'use strict'

const Syllabus = require('../models').syllabuses
const User = require('../models').users
const Assignment = require('../models').assignments
const Material = require('../models').materials
const SyllabusStudent = require('../models').syllabus_students
const _ = require('lodash')

/**
 * Syllabus controller 
 */

 function create(req, res) {
 	if( req.user.usertype != 1 ) {
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }

    if( !req.body.tittle || !req.body.description )
    return res.status(400).send({ error: 'Datos incompletos' })

    if( !req.body.public && !req.body.key )
    	return res.status(400).send({ error: 'No se asignó una contraseña para el syllabus' })

    if( req.body.public == true ) 
    	req.body.key = null

    req.body.user_id = req.user.sub

    Syllabus.create( req.body )
        .then(syllabus => {
            return res.sendStatus(201)
        })
        .catch(error => {
            error = _.omit(error, ['parent', 'original', 'sql'])
            return res.status(400).send(error)
        })
}

function get(req, res) {
	Syllabus.findOne({
        where: {
            id: req.params.id
        },
        include: [ 
        	{ 
        		model: User, 
        		attributes: ['name', 'id', 'username', 'email'] 
        	},
        	{
                model: Assignment,
                as: 'assignments',
        		attributes: ['id',  'tittle', 'description', 'init_date', 'end_date']
        	} 
        ],
        attributes: ['id', 'tittle', 'description', 'public', 'key']
    })
        .then((syllabus) => {
            return res.status(200).send({ syllabus })
        })
        .catch((err) => {
            return res.status(500).send({ error: `${err}` })
        })
}

function list(req, res) {
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 10
    let offset = (req.query.page) ? limit * ( parseInt(req.query.page) - 1 ) : 0

    let condition = {}
    let meta = {}

    if( req.query.coach )
        condition.user_id = req.query.coach
    else
        condition.id = { $ne: null }

    if( req.query.filter ) {
        if( req.query.filter == 'private' ) condition.public = false
        else condition.public = true
    }

    Syllabus.findAndCountAll({
        where: condition,
        include: [ 
        	{ 
                model: User, 
        	    attributes: ['name', 'id', 'username', 'email'] 
        	}
        ],
        attributes: ['id', 'tittle', 'description', 'public'],
        limit: limit,
        offset: offset
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

function remove(req, res) {
    if( req.user.usertype != 1 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    let condition = {
        id: req.params.id,
        user_id: req.user.sub
    }

    Syllabus.destroy({
        where: condition
    })
    .then( function( deletedRecords ) {
        if (deletedRecords) return res.status(200).json(deletedRecords);
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    })
    .catch(function (error) {
        return res.status(500).json(error);
    });
}

function update(req, res) {
    if( req.user.usertype != 1 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    if( !req.body.tittle || !req.body.description )
        return res.status(400).send({ error: 'Datos incompletos' })
    
    if( !req.body.public && !req.body.key )
        return res.status(400).send({ error: 'No se asignó una contraseña para el syllabus' })
    
    if( req.body.public == true ) 
        req.body.key = null

    let condition = {
        id: req.params.id,
        user_id: req.user.sub
    }

    Syllabus.update(
        req.body,
        {
            where: condition
        }
    ).then( ( affectedRows ) => {
        if ( affectedRows > 0 ) return res.status(200).send(req.body)

        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }).catch((err) => {
        return res.sendStatus(500)
    })
}

function assignMaterialsToSyllabus (req,res){
    if( req.user.usertype != 1 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    
    if( !req.body.materials )
        return res.status(400).send({ error: 'Datos incompletos' })

    Syllabus.findById( req.params.id )
    .then( (syllabus) => {
        if( req.user.sub != syllabus.user_id )
            return res.status(401).send({ error: 'No se encuentra autorizado' })

        syllabus.addMaterials( req.body.materials ).then( (materials) => {
            return res.sendStatus(201)
        }).catch( (err) => {
            return res.sendStatus(500)
        })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function removeMaterialsFromSyllabus (req,res){
    if( req.user.usertype != 1 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    
    if( !req.body.materials )
        return res.status(400).send({ error: 'Datos incompletos' })

    Syllabus.findById( req.params.id )
    .then( (syllabus) => {
        if( req.user.sub != syllabus.user_id )
            return res.status(401).send({ error: 'No se encuentra autorizado' })

        syllabus.removeMaterials( req.body.materials ).then( (materials) => {
            return res.sendStatus(200)
        }).catch( (err) => {
            return res.sendStatus(500)
        })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function getMaterials (req,res){
    Syllabus.findOne({
         where: {id : req.params.id },
         include: [ 
        	{ 
        		model: User, 
        		attributes: ['name', 'id', 'username', 'email'] 
        	},
        	{
                model: Material,
                as: 'materials',
                attributes: ['id',  'name', 'description', 'category_id', 'url'],
                through: { attributes: [] }
        	} 
        ]
    }).then( (syllabus) => {
        if( syllabus == null ) return res.sendStatus(404)
        return res.status(200).send({ syllabus })
    }).catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function registerStudent (req,res){
    if( req.user.usertype != 0 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    Syllabus.findById( req.params.id )
    .then( (syllabus) => {
        if( !syllabus.public && !req.body.key )
            return res.status(400).send({ error: 'Datos incompletos' })
        
        if( !syllabus.public && req.body.key != syllabus.key )
            return res.status(401).send({ error: 'Clave del syllabus incorrecta' })

        syllabus.addUsers( req.user.sub ).then( (user) => {
            return res.sendStatus(201)
        }).catch( (err) => {
            return res.sendStatus(500)
        })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function removeStudents (req,res){
    if( req.user.usertype == 2 )
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    Syllabus.findById( req.params.id )
    .then( (syllabus) => {
        if( req.user.usertype == 1 && req.user.sub != syllabus.user_id )
            return res.status(401).send({ error: 'No se encuentra autorizado' })
        
        if( req.user.usertype == 1 && !req.body.students )
            return res.status(400).send({ error: 'Datos incompletos' })

        if( req.user.usertype == 0 )
            req.body.students = req.user.sub
        
        syllabus.removeUsers( req.body.students ).then( (students) => {
            return res.sendStatus(200)
        }).catch( (err) => {
            return res.sendStatus(500)
        })
    })
    .catch( (err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function hasPermission ( user, syllabus_id, cb ){
    if( user.usertype == 1 ){
        Syllabus.findOne({
            where: {
                id: syllabus_id,
                user_id: user.sub
            },
            attributes: ['id']
        }).then( response => {
            if( !response ) cb( null, false )
            cb( null, true )
        })
        .catch( (err) => {
            cb( err, null )
        })
    }else{
        SyllabusStudent.findOne({
            where: {
                syllabus_id: syllabus_id,
                user_id: user.sub
            },
            attributes: ['id']
        }).then( response => {
            if( !response ) cb( null, false )
            cb( null, true )
        })
        .catch( (err) => {
            cb( err, null )
        })
    }
}



module.exports = {
    create,
    get,
    list,
    remove,
    update,
    assignMaterialsToSyllabus,
    getMaterials,
    removeMaterialsFromSyllabus,
    registerStudent,
    removeStudents,
    hasPermission
}