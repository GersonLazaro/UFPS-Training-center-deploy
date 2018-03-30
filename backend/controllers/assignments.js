'use strict'

const Assignment = require('../models').assignments
const Submissions = require('../models').submissions
const SyllabusStudents = require('../models').syllabus_students
const Syllabus = require('../models').syllabuses
const Problem = require('../models').problems
const _ = require('lodash')

/**
 * Assignments controller 
 */
function create(req, res) {
    if( req.user.usertype != 1 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    
    if( !req.body.tittle || !req.body.description || !req.body.init_date || 
        !req.body.end_date || !req.body.syllabus_id || !req.body.problems )
        return res.status(400).send({ error: 'Datos incompletos' })

    Assignment.create( req.body )
    .then( assignment => {
        if( req.body.problems.length > 0 ){
            assignment.addProblems( req.body.problems ).then( (materials) => {
                return res.sendStatus(201)
            })
        }else 
            return res.sendStatus( 201 )
    })
    .catch( error => {
        error = _.omit( error, ['parent', 'original', 'sql'] )
        return res.status( 400 ).send( error )
    })
}

function update(req, res) {
    if( req.user.usertype != 1 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    
    if( !req.body.tittle || !req.body.description || !req.body.init_date || 
        !req.body.end_date )
        return res.status(400).send({ error: 'Datos incompletos' })

    let condition = {
        id: req.params.id
    }

    Assignment.update(
        req.body,
        {
            where: condition
        }
    ).then((affectedRows) => {
        if (affectedRows) return res.status(200).send(req.body)

        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }).catch((err) => {
        return res.sendStatus(500)
    })
}

function remove(req, res) {
    if( req.user.usertype != 1 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    let condition = {
        id: req.params.id
    }

    Assignment.destroy({
        where: condition
    })
        .then(function (deletedRecords) {
            if ( deletedRecords == 1 ) return res.status(200).json(deletedRecords)
            else return res.sendStatus(404)
        })
        .catch(function (error) {
            return res.status(500).json(error);
        });
}

function get(req, res) {
    Assignment.findOne({
        where: {
            id: req.params.id
        },
        include: [ 
        	{
                model: Problem,
                as: 'problems',
                attributes: ['id', 'title_es', 'title_en', 'level', 'category_id', 'time_limit'],
                through: { attributes: ['id'] }
        	} 
        ],
        attributes: ['id', 'tittle', 'init_date', 'description', 'end_date', 'syllabus_id']
    })
        .then( (assignment) => {
            if( !assignment ) return res.status(404).send({ error: 'Tarea no encontrada' })
            return res.status(200).send({ assignment })
        })
        .catch((err) => {
            return res.status(500).send({ error: `${err}` })
        })
}

function addProblems (req,res){
    if( req.user.usertype != 1 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    if( !req.body.problems )
        return res.status(400).send({ error: 'Datos incompletos' })

    Assignment.findById( req.params.id )
    .then( (assignment) => {
        assignment.addProblems( req.body.problems ).then( (problems) => {
            return res.sendStatus(201)
        })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function deleteProblems (req,res){
    if( req.user.usertype != 1 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    if( !req.body.problems )
        return res.status(400).send({ error: 'Datos incompletos' })

    Assignment.findById( req.params.id )
    .then( (assignment) => {
        assignment.removeProblems( req.body.problems ).then( (problems) => {
            return res.sendStatus(201)
        })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function getSubmissions (req,res){
    if( !req.query.page )
      return res.status(400).send({ error: 'Datos incompletos' })  

    isOwner( req.user, req.params.id, (err, ans) =>{
        let limit = (req.query.limit) ? parseInt(req.query.limit) : 10
        let order = []
        let offset = (req.query.page) ? limit * ( parseInt(req.query.page) - 1 ) : 0
        let by = (req.query.by) ? req.query.by : 'DESC'

        let condition = {
            assignment_problem_id: req.params.pid
        }
        let meta = {}
        order[0] = ['created_at', by]

        if (req.query.sort && req.query.sort == 'time' ) 
            order[0] = ['execution_time', by]

        if( req.query.condition ){
            if( req.query.condition == 'WA') condition.verdict = 'Wrong Answer'
            else if( req.query.condition == 'TL') condition.verdict = 'Time Limit Exceeded'
            else if( req.query.condition == 'RT') condition.verdict = 'Runtime Error'
            else if( req.query.condition == 'CE') condition.verdict = 'Compilation Error'
            else condition.verdict = 'Accepted'
        }

        Submissions.findAndCountAll({
            where: condition,
            attributes: ['id', 'language', 'execution_time', 'verdict', 'status', 'created_at'],
            limit: limit,
            order: order,
            offset: offset,
        })
        .then((response) => {
            meta.totalPages = Math.ceil( response.count / limit )
            meta.totalItems = response.count

            if ( offset >= response.count ) 
              return res.status(200).send( { meta } )
            return res.status(200).send({ meta: meta, data: response.rows })
        })
        .catch((err) => {
            return res.status(500).send({ error: `${err}` })
        })
    })
}

function isOwner ( user, assignment_id, cb ){
    Assignment.findOne({
        include: [{ 
            model: Syllabus, 
            where: { user_id: user.sub }, 
            attributes: ['id'] 
        }],
        where:{
            id: assignment_id
        },
        attributes: ['id']
    }).then( response => {
        if( !response )
            return cb( null, false )
        return cb( null, true )
    }).catch( (err) => {
        return cb( err, null )
    })
}

module.exports = {
    create,
    remove,
    get,
    update,
    addProblems,
    deleteProblems,
    getSubmissions,
    isOwner
}
