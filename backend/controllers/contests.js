'use strict'

const Contest = require('../models').contests
const ContestProblems = require('../models').contests_problems
const Problem = require('../models').problems
const User = require('../models').users
const ContestStudent = require('../models').contests_students
const _ = require('lodash')
const moment = require('moment')

/**
 * Contests controller
 */
function create(req, res) {
    if( !req.body.title || !req.body.description || !req.body.init_date || !req.body.end_date || !req.body.rules )
        return res.status(400).send({ error: 'Datos incompletos' })
    
    if( req.body.public == false && !req.body.key )
    	return res.status(400).send({ error: 'No se asignó una contraseña para la maraton' })
    
    if( req.body.public == true ) 
        req.body.key = null
    
    let start = moment( req.body.init_date )
    let end = moment( req.body.end_date )

    if( start < moment() )
        return res.status(400).send({ error: 'La fecha de inicio de la maraton debe ser mayor a la fecha actual' })

    if( end.diff(start, 'minutes') < 30 )
        return res.status(400).send({ error: 'La duración mínima de la maraton debe ser 30 minutos' })
    
    req.body.user_id = req.user.sub

    Contest.create( req.body )
        .then(category => {
            return res.sendStatus(201)
        })
        .catch(error => {
            error = _.omit(error, ['parent', 'original', 'sql'])
            return res.status(500).send(error)
        })
}

function index(req, res) {
    Contest.findOne({
        where: {
            id: req.params.id
        },
        include: [ 
        	{ 
        		model: User, 
        		attributes: ['name', 'id', 'username', 'email'] 
        	}
        ],
        attributes: ['id', 'title', 'description', 'init_date', 'end_date', 'rules', 'public', 'key']
    })
        .then((contest) => {
            return res.status(200).send({ contest })
        })
        .catch((err) => {
            return res.status(500).send({ error: `${err}` })
        })
}

function update(req, res) {
    if( !req.body.title || !req.body.description || !req.body.init_date || !req.body.end_date || !req.body.rules )
        return res.status(400).send({ error: 'Datos incompletos' })
    
    if( !req.body.public && !req.body.key )
        return res.status(400).send({ error: 'No se asignó una contraseña para el syllabus' })
    
    if( req.body.public == true ) 
        req.body.key = null
    
    let start = moment( req.body.init_date )
    let end = moment( req.body.end_date )

    if( start < moment() )
        return res.status(400).send({ error: 'La fecha de inicio de la maraton debe ser mayor a la fecha actual' })

    if( end.diff(start, 'minutes') < 30 )
        return res.status(400).send({ error: 'La duración mínima de la maraton debe ser 30 minutos' })

    req.body.user_id = req.user.sub
    
    Contest.findById( req.params.id ).then( contest => {
        let init_date = moment( contest.init_date )
        let end_date = moment( contest.end_date )

        if( init_date < moment() && start != init_date )
            return res.status(400).send({ error: 'No se puede cambiar la fecha de inicio de una maraton que ya inició' }) 
        
        if( end_date < moment() && end != end_date )
            return res.status(400).send({ error: 'No se puede cambiar la fecha de fin de una maraton que ya acabó' }) 
        
        if( contest.user_id != req.body.user_id )
            return res.status(401).send({ error: 'No se encuentra autorizado' })

        Contest.update(
            req.body,
            { 
                where: { id: req.params.id }
            }
        ).then( updated => {
            return res.status(200).send( req.body )
        }).catch((err) => {
            return res.sendStatus(500)
        })
    }).catch((err) => {
        return res.sendStatus(500)
    })
}

function remove(req, res) {
    Contest.findById( req.params.id ).then( contest => {
        if( contest == null ) 
            return res.sendStatus(404)

        if( contest.user_id != req.user.sub )
            return res.status(401).send({ error: 'No se encuentra autorizado' })

        if( contest.init_date < moment() )
            return res.status(400).send({ error: 'No se puede eliminar una maraton que ya inició' })
        
        ContestProblems.destroy({
            where: { contest_id: req.params.id }
        }).then( success => {
            Contest.destroy({
                where: { id: req.params.id }
            })
            .then( function( deletedRecords ) {
                return res.status(200).json(deletedRecords);
            }).catch((err) => {
                return res.sendStatus(500)
            })
        }).catch((err) => {
            return res.sendStatus(500)
        })

    }).catch((err) => {
        return res.sendStatus(500)
    })
}

function getProblems(req, res) {
    Contest.findOne({
        where: {id : req.params.id },
        include: [ 
           { 
               model: Problem, 
               as: 'problems',
               attributes: ['id', 'title_es', 'title_en', 'level'],
               through: { attributes: [] }
           } 
       ]
   }).then( (contest) => {
       if( contest == null ) return res.sendStatus(404)
       return res.status(200).send({ contest })
   }).catch( (err) => {
       return res.status(500).send({ error: `${err}` })
   })
}

function addProblems(req, res) {
    if( !req.body.problems )
        return res.status(400).send({ error: 'Datos incompletos' })

    Contest.findById( req.params.id )
    .then( (contest) => {
        if( contest == null )
           return res.sendStatus( 404 )

        if( contest.user_id != req.user.sub )
            return res.status(401).send({ error: 'No se encuentra autorizado' })
        
        let init_date = moment( contest.init_date )

        if( init_date < moment() )
            return res.status(400).send({ error: 'No se puede modificar una maraton que ya inició' }) 

        contest.addProblems( req.body.problems ).then( (problems) => {
            return res.sendStatus(201)
        }).catch( (err) => {
            return res.sendStatus(500)
        })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function removeProblems(req, res) {
    if( !req.body.problems )
        return res.status(400).send({ error: 'Datos incompletos' })

    Contest.findById( req.params.id )
    .then( (contest) => {
        if( contest == null )
           return res.sendStatus( 404 )

        if( contest.user_id != req.user.sub )
            return res.status(401).send({ error: 'No se encuentra autorizado' })
        
        let init_date = moment( contest.init_date )

        if( init_date < moment() )
            return res.status(400).send({ error: 'No se puede modificar una maraton que ya inició' }) 

        contest.removeProblems( req.body.problems ).then( (problems) => {
            return res.sendStatus(201)
        }).catch( (err) => {
            return res.sendStatus(500)
        })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function registerStudent(req, res) {
    if( req.user.usertype != 0 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    Contest.findById( req.params.id )
    .then( (contest) => {
        if( contest == null)
            return res.sendStatus(404)

        if( !contest.public && !req.body.key )
            return res.status(400).send({ error: 'Datos incompletos' })
        
        if( !contest.public && req.body.key != contest.key )
            return res.status(401).send({ error: 'Clave de la maratón incorrecta' })
        
        let end_date = moment( contest.end_date )

        if( end_date < moment() )
            return res.status(400).send({ error: 'No se puede registrar en una maraton que ya acabo' }) 

        contest.addUsers( req.user.sub ).then( (user) => {
            return res.sendStatus(201)
        }).catch( (err) => {
            return res.sendStatus(500)
        })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function removeStudent(req, res) {
    if( req.user.usertype != 0 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    Contest.findById( req.params.id )
    .then( (contest) => {
        if( contest == null)
            return res.sendStatus(404)
        
        let end_date = moment( contest.end_date )

        if( end_date < moment() )
            return res.status(400).send({ error: 'No se puede desregistrar en una maraton que ya acabo' }) 

        contest.removeUsers( req.user.sub ).then( (user) => {
            return res.sendStatus(201)
        }).catch( (err) => {
            return res.sendStatus(500)
        })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function list(req, res) {
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 10
    let offset = (req.query.page) ? limit * ( parseInt(req.query.page) - 1 ) : 0

    let condition = {}
    let meta = {}

    if( req.query.user )
        condition.user_id = req.query.user
    else
        condition.id = { $ne: null }

    if( req.query.filter ) {
        if( req.query.filter == 'private' ) condition.public = false
        else condition.public = true
    }

    if( req.query.status ){
        if( req.query.status == 'running'){
            condition.init_date = { $lte: moment() }
            condition.end_date = { $gte: moment() }
        }else if( req.query.status == 'past' ){
            condition.end_date = { $lt: moment() }
        }else{
            condition.init_date = { $gt: moment() }
        }
    }

    Contest.findAndCountAll({
        where: condition,
        include: [ 
        	{ 
                model: User, 
        	    attributes: ['name', 'id', 'username', 'email'] 
        	}
        ],
        attributes: ['id', 'title', 'description', 'init_date', 'end_date', 'rules', 'public', 'key'],
        limit: limit,
        offset: offset,
        order: [
            ['init_date', 'DESC']
        ]
    }).then( ( response ) => {
        meta.totalPages = Math.ceil( response.count / limit )
        meta.totalItems = response.count

        if ( offset >= response.count ) {
            return res.status(200).send( { meta } )
        }
        res.status(200).send({ meta: meta, data: response.rows })
    }).catch((err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function isRegister (req,res){
    if( !req.query.student )
        return res.status(400).send({ error: 'Datos incompletos' })

    ContestStudent.findOne({
        where: {
            contest_id: req.params.id,
            user_id: req.query.student
        },
        attributes: ['id']
    }).then( response => {
        let status = 'registered';

        if( !response ) status = 'unregistered'
        return res.status(200).send({ status: status })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function hasPermission ( user_id, contest_id, cb ){
    Contest.findOne({
        where: {id : contest_id }
   }).then( (contest) => {
       if( contest.public ) return cb( null, true )
       if( contest.user_id == user_id ) return cb( null, true )

       ContestStudent.findOne({
            where: {
                contest_id: contest_id,
                user_id: user_id
            },
            attributes: ['id']
        }).then( response => {
            if( !response ) return cb( null, false )
            return cb( null, true )
        })
        .catch( (err) => {
            return cb( err, null )
        })
   }).catch( (err) => {
        return cb( err, null )
   })
}

module.exports = {
    create,
    index,
    list,
    update,
    remove,
    getProblems,
    addProblems,
    removeProblems,
    registerStudent,
    removeStudent,
    isRegister,
    hasPermission
}