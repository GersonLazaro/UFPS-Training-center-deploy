'use strict'

const _ = require('lodash');
const env = process.env.NODE_ENV || "development"
const config = require('../config/config.js')[env]
const Sequelize = require('sequelize')
const sequelize = new Sequelize( config.url, config )
const syllabusesCtrl = require('../controllers/syllabuses')
const assignmentsCtrl = require('../controllers/assignments')

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
        'SELECT u.username, COUNT(s.problem_id) as total, '
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
              'SELECT u.name, u.id, '
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
      'SELECT u.id, u.username, u.code, u.name, solved_problems.assignment_problem_id, solved_problems.problem_id  '
      +'FROM syllabus_students ss LEFT JOIN '
      +'( SELECT s.user_id, s.assignment_problem_id, s.problem_id '
        +'FROM submissions s, assignment_problems ap '
        +'WHERE s.assignment_problem_id = ap.id '
        +'AND ap.assignment_id = ' + req.params.id + ' '
        +'AND s.verdict = "Accepted" '
        +'GROUP BY s.user_id, s.assignment_problem_id '
      +') as solved_problems '
      +'ON solved_problems.user_id = ss.user_id, '
      +'users u, assignments a '
      +'WHERE ss.user_id = u.id '
      +'AND ss.syllabus_id = a.syllabus_id '
      +'AND  a.id = ' + req.params.id + ' '
      +'ORDER BY u.id DESC '
    ).then( ranking => {
      return res.status(200).send( ranking[0] )
    }).catch(error => {
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

module.exports = {
  getRanking,
  getSyllabusRanking,
  getAssignmentResult,
  getAssignmentProbVerdicts,
  getAssignmentProbLanguages
}