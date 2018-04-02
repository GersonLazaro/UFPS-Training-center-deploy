'use strict'

const _ = require('lodash');
const env = process.env.NODE_ENV || "development"
const config = require('../config/config.js')[env]
const Sequelize = require('sequelize')
const sequelize = new Sequelize( config.url, config )
const syllabusesCtrl = require('../controllers/syllabuses')
const assignmentsCtrl = require('../controllers/assignments')
const contestsCtrl = require('../controllers/contests')
const moment = require('moment')

/**
 * Statistics controller 
 */

function getRanking(req, res) {
  if( !req.query.page )
    return res.status(400).send({ error: 'Datos incompletos' })

  let limit = (req.query.limit) ? parseInt(req.query.limit) : 10
  let offset = (req.query.page) ? limit * ( parseInt(req.query.page) - 1 ) : 0

  let condition = {}
  let meta = {}

  sequelize.query(
      'SELECT count(users.id) AS count '
      +'FROM users',
      { type: Sequelize.QueryTypes.SELECT }
  ).then( response => {
      meta.totalPages = Math.ceil( response[0].count / limit )
      meta.totalItems = response[0].count

      if ( offset >= response[0].count )
        return res.status(200).send( { meta } )
      
      sequelize.query(
        'SELECT u.username, u.name, COUNT(s.problem_id) as total, '
        +'(SELECT COUNT( DISTINCT(problem_id) ) '
        +'FROM submissions '
        +'WHERE verdict="Accepted" '
        +'AND user_id = u.id) as accepted '
        +'FROM users as u '
        +'LEFT JOIN submissions as s '
        +'ON u.id = s.user_id '
        +'GROUP BY u.id '
        +'ORDER BY accepted DESC, total ASC '
        +'LIMIT ' + offset + ', ' + limit,
        { type: Sequelize.QueryTypes.SELECT }
      ).then( ranking => {
        res.status(200).send({ meta: meta, data: ranking })
      }).catch(error => {
        return res.status(500).send(error)
      })
  }).catch(error => {
    return res.status(500).send(error)
  })
}

function getSyllabusRanking(req, res) {
    if( !req.query.page )
      return res.status(400).send({ error: 'Datos incompletos' })
      
    syllabusesCtrl.hasPermission( req.user, req.params.id, (err, ans) =>{
        if( err )
            return res.status(500).send(err)

        if( !ans )
            return res.status(401).send({ error: 'No se encuentra autorizado' })
        
        let limit = (req.query.limit) ? parseInt(req.query.limit) : 10
        let offset = (req.query.page) ? limit * ( parseInt(req.query.page) - 1 ) : 0
          
        let meta = {}

        sequelize.query(
            'SELECT count(s.user_id) AS count '
            +'FROM syllabus_students s '
            +'WHERE s.syllabus_id = ' + req.params.id,
            { type: Sequelize.QueryTypes.SELECT }
        ).then( response => {
            meta.totalPages = Math.ceil( response[0].count / limit )
            meta.totalItems = response[0].count
      
            if ( offset >= response[0].count )
              return res.status(200).send( { meta } )
            
            sequelize.query(
              'SELECT u.name, u.username, u.id, '
              +'COUNT( syllabus_submissions.assignment_problem_id ) as total, '
              +'( '
                +' SELECT COUNT( DISTINCT(s.assignment_problem_id) ) '
                +' FROM submissions s, assignment_problems ap, assignments a '
                +' WHERE s.assignment_problem_id = ap.id '
                +' AND ap.assignment_id = a.id '
                +' AND a.syllabus_id = ' + req.params.id + ' '
                +' AND s.verdict="Accepted" '
                +' AND s.user_id = u.id'
              +') as accepted '
              +'FROM users u, '
              +'syllabus_students ss LEFT JOIN '
              +'( SELECT s.assignment_problem_id, s.user_id '
                +' FROM submissions s, assignment_problems ap, assignments a'
                +' WHERE s.assignment_problem_id = ap.id'
                +' AND ap.assignment_id = a.id'
                +' AND a.syllabus_id = ' + req.params.id + ') AS syllabus_submissions '
              +'ON ss.user_id = syllabus_submissions.user_id '
              +'WHERE ss.syllabus_id = ' + req.params.id + ' '
              +'AND u.id = ss.user_id '
              +'GROUP BY u.id '
              +'ORDER BY accepted DESC, total ASC '
              +'LIMIT ' + offset + ', ' + limit,
              { type: Sequelize.QueryTypes.SELECT }
            ).then( ranking => {
              return res.status(200).send({ meta: meta, data: ranking })
            }).catch(error => {
                return res.status(500).send(error)
            })
        }).catch(error => {
            return res.status(500).send(error)
        })
    })
}

function getAssignmentResult(req, res) {
  assignmentsCtrl.isOwner( req.user, req.params.id, (err, ans) =>{
    if( err )
      return res.status(500).send(err)

    if( !ans )
      return res.status(401).send({ error: 'No se encuentra autorizado' })

    sequelize.query(
      'SELECT u.id, u.code, u.username, u.name '
      +'FROM users u, syllabus_students ss, assignments a '
      +'WHERE u.id = ss.user_id '
      +'AND ss.syllabus_id = a.syllabus_id '
      +'AND a.id = ' + req.params.id
    ).then( users => {
      let index = {}
      let ans = []
      let i
      for( i = 0; i < users[0].length; i++ ){
        ans[i] = users[0][i]
        ans[i].assignment_problems = []
        index[ users[0][i].id ] = i
      }
      sequelize.query(
        'SELECT s.user_id, s.assignment_problem_id '
        +'FROM submissions s, assignment_problems ap '
        +'WHERE s.assignment_problem_id = ap.id '
        +'AND ap.assignment_id = ' + req.params.id + ' '
        +'AND s.verdict = "Accepted" '
        +'GROUP BY s.user_id, s.assignment_problem_id '
      ).then( submissions => {
        let aux
        for( i = 0; i < submissions[0].length; i++ ){
          aux = index[ submissions[0][i].user_id ]
          ans[ aux ].assignment_problems.push( submissions[0][i].assignment_problem_id )
        }
        return res.status(200).send( ans )
      }).catch( error => {
        return res.status(500).send(error)
      })
    }).catch( error => {
      return res.status(500).send(error)
    })
  })
}

function getAssignmentProbVerdicts(req, res) {
  assignmentsCtrl.isOwner( req.user, req.params.id, (err, ans) =>{
    if( err )
      return res.status(500).send(err)

    if( !ans )
      return res.status(401).send({ error: 'No se encuentra autorizado' })

    sequelize.query(
      'SELECT s.verdict, COUNT(s.id) AS total '
      +'FROM submissions s '
      +'WHERE s.assignment_problem_id = ' + req.params.pid + ' '
      +'GROUP BY s.verdict '
    ).then( ranking => {
      return res.status(200).send( ranking[0] )
    }).catch(error => {
      return res.status(500).send(error)
    })
  })
}

function getAssignmentProbLanguages(req, res) {
  assignmentsCtrl.isOwner( req.user, req.params.id, (err, ans) =>{
    if( err )
      return res.status(500).send(err)

    if( !ans )
      return res.status(401).send({ error: 'No se encuentra autorizado' })

    sequelize.query(
      'SELECT s.language, COUNT(s.id) AS total '
      +'FROM submissions s '
      +'WHERE s.assignment_problem_id = ' + req.params.pid + ' '
      +'GROUP BY s.language '
    ).then( ranking => {
      return res.status(200).send( ranking[0] )
    }).catch(error => {
      return res.status(500).send(error)
    })
  })
}

function getLanguagesStatistic( req, res ){
  if ( req.params.id != req.user.sub ) 
    return res.status(401).send({ error: 'No se encuentra autorizado' })

  sequelize.query(
    'SELECT s.language, COUNT(s.id) AS total '
    +'FROM submissions s '
    +'WHERE s.user_id = ' + req.params.id + ' '
    +'GROUP BY s.language '
  ).then( ranking => {
    return res.status(200).send( ranking[0] )
  }).catch(error => {
    return res.status(500).send(error)
  })
}

function getVerdictsStatistic( req, res ){
  if ( req.params.id != req.user.sub ) 
    return res.status(401).send({ error: 'No se encuentra autorizado' })

  sequelize.query(
    'SELECT s.verdict, COUNT(s.id) AS total '
    +'FROM submissions s '
    +'WHERE s.user_id = ' + req.params.id + ' '
    +'GROUP BY s.verdict '
  ).then( ranking => {
    return res.status(200).send( ranking[0] )
  }).catch(error => {
    return res.status(500).send(error)
  })
}

function getContestScoreboard(req, res) {
  contestsCtrl.hasPermission( req.user.sub, req.params.id, (err, ans) =>{
    if( err )
      return res.status(500).send(err)

    if( !ans )
      return res.status(401).send({ error: 'No se encuentra autorizado' })

    sequelize.query(
      'SELECT u.id, u.code, u.username, u.name, c.init_date '
      +'FROM users u, contests_students cs, contests c '
      +'WHERE u.id = cs.user_id '
      +'AND cs.contest_id = ' + req.params.id + ' '
      +'AND c.id = ' + req.params.id
    ).then( users => {
      let index = {}
      let ans = []
      let i
      let init_date = moment( users[0][0].init_date )

      for( i = 0; i < users[0].length; i++ ){
        ans[i] = users[0][i]
        ans[i].problems = {}
        ans[i].total_accepted = 0
        ans[i].total_time = 0
        index[ users[0][i].id ] = i
      }
      sequelize.query(
        'SELECT s.user_id, s.contest_problem_id, s.verdict, s.created_at, s.id '
        +'FROM submissions s, contests_problems cp '
        +'WHERE s.contest_problem_id = cp.id '
        +'AND cp.contest_id = ' + req.params.id + ' '
        +'ORDER BY s.created_at ASC'
      ).then( submissions => {
        let aux, minutes, sub_date, sub_data, problem_id, cp_data

        for( i = 0; i < submissions[0].length; i++ ){
          aux = index[ submissions[0][i].user_id ]
          sub_date = moment( submissions[0][i].created_at )
          minutes = sub_date.diff( init_date, 'minutes' )
          problem_id = submissions[0][i].contest_problem_id

          /*sub_data = {
            submission_id: submissions[0][i].id,
            submission_minute: minutes,
            submission_verdict: submissions[0][i].verdict
          }*/

          if( !ans[aux].problems[ problem_id ] ){
            cp_data = {
              errors: 0,
              accepted: false,
              min_accepted: 0,
              //submissions: []
            }
            ans[aux].problems[ problem_id ] = cp_data
          }

          if( submissions[0][i].verdict != 'Accepted' && !ans[aux].problems[ problem_id ].accepted )
            ans[aux].problems[ problem_id ].errors++

          if( submissions[0][i].verdict == 'Accepted' && !ans[aux].problems[ problem_id ].accepted ){
            ans[ aux ].total_accepted++
            ans[aux].problems[ problem_id ].accepted = true
            ans[aux].problems[ problem_id ].min_accepted = minutes
            ans[ aux ].total_time += minutes + ( ans[aux].problems[ problem_id ].errors * 20 )
          }

          //ans[aux].problems[ problem_id ].submissions.push( sub_data )
        }
        return res.status(200).send( ans )
      }).catch( error => {
        return res.status(500).send(error)
      })
    }).catch( error => {
      return res.status(500).send(error)
    })
  })
}

module.exports = {
  getRanking,
  getSyllabusRanking,
  getAssignmentResult,
  getAssignmentProbVerdicts,
  getAssignmentProbLanguages,
  getLanguagesStatistic,
  getVerdictsStatistic,
  getContestScoreboard
}