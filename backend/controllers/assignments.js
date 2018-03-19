'use strict'

const Assignment = require('../models').assignments
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
                attributes: ['id', 'title_es', 'title_en', 'level', 'description_en', 'description_es',
                'example_input', 'example_output', 'category_id', 'time_limit'],
                through: { attributes: [] }
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

module.exports = {
    create,
    remove,
    get,
    update,
    addProblems,
    deleteProblems
}
