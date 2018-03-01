'use strict'

const Material = require('../models/materials')
const Category = require('../models/categories')
const User = require('../models/users')
const _ = require('lodash')
const files = require('../services/files')

/**
 * Materials controller 
 */

function index(req,res){
    listAll(req, res, true)
}

function pending(req, res){
    listAll(req, res, false)
}

function listAll(req,res, pending){
    if (!pending && req.user.usertype != 2) 
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    

    let limit = (req.query.limit) ? parseInt(req.query.limit) : 10
    let order = []
    let offset = (req.query.page) ? limit * ( parseInt(req.query.page) - 1 ) : 0
    let by = (req.query.by) ? req.query.by : 'ASC'
    let condition = {
        status: pending
    }
    let meta = {}

    if (req.query.sort) {
        if (req.query.sort == 'name') order[0] = ['name', by]
    } else order[0] = ['id', by]

    Material.findAndCountAll({
        where: condition,
        include: [ 
            { model: User, attributes: ['name', 'id', 'username'] },
            { model: Category, attributes: ['name', 'id'] }
        ],
        attributes: ['id', 'name', 'user_id', 'description', 'url', 'category_id'],
        limit: limit,
        order: order,
        offset: offset,
    })
    .then((response) => {
        meta.totalPages = Math.ceil( response.count / limit )
        meta.totalItems = response.count
        
        if ( offset >= response.count ) {
            return res.status(200).send( { meta } )
        }
        res.status(200).send({ meta: meta, data: response.rows })
    })
    .catch((err) => {
        return res.status(500).send({ error: `${err}` })
    })
}

function create(req, res) {
    req.body = req.body.data

    if( !req.body.name || !req.body.category || !req.body.description || !req.body.content )
        return res.sendStatus( 400 )

    if( req.body.content.toUpperCase() == "URL" && !req.body.url )
        return res.sendStatus( 400 )

    if( req.body.content.toUpperCase() == "PDF" && !req.files )
        return res.sendStatus( 400 )

    if( req.body.content.toUpperCase() == "PDF" )
        req.body.url = req.files['pdf'][0].path
    
    if (req.user.usertype == 0) 
        req.body.status = false
    else 
        req.body.status = true

    req.body.category_id = req.body.category
    req.body.user_id = req.user.sub

    Material.create( req.body )
        .then( material => {
            return res.sendStatus( 201 )
        })
        .catch( error => {
            error = _.omit( error, ['parent', 'original', 'sql'] )
            return res.status( 400 ).send( error )
        })
}

function update(req, res) {
    req.body = req.body.data

    if( !req.body.name || !req.body.category || !req.body.description || !req.body.content )
        return res.sendStatus( 400 )

    if( req.body.content.toUpperCase() == "URL" && !req.body.url )
        return res.sendStatus( 400 )

    let condition = {
        id: req.params.id
    }
    
    if (req.user.usertype == 0) {
        condition.user_id = req.user.sub
    }

    req.body.category_id = req.body.category

    if( req.body.content.toUpperCase() == "PDF" && req.files )
        req.body.url = req.files['pdf'][0].path

    Material.update(
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
    let condition = {
        id: req.params.id
    }
    
    if (req.user.usertype == 0) {
        condition.user_id = req.user.sub
    }

    Material.destroy({
        where: condition
    })
        .then(function (deletedRecords) {
            if (deletedRecords) return res.status(200).json(deletedRecords)
            return res.status(401).send({ error: 'No se encuentra autorizado' })
        })
        .catch(function (error) {
            return res.status(500).json(error);
        });
}

function get(req, res) {
    Material.findOne({
        where: {
            id: req.params.id,
            status: true
        },
        include: [ 
            { model: User, attributes: ['name', 'id', 'username'] },
            { model: Category, attributes: ['name', 'id'] }
        ],
        attributes: ['id', 'name', 'category_id', 'description', 'url', 'user_id']
    })
        .then( (material) => {
            if( !material ) return res.status(404).send({ error: 'Material no encontrado' })
            return res.status(200).send({ material })
        })
        .catch((err) => {
            return res.status(500).send({ error: `${err}` })
        })
}

function list(req, res) {
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 10
    let order = []
    let offset = (req.query.page) ? limit * ( parseInt(req.query.page) - 1 ) : 0
    let by = (req.query.by) ? req.query.by : 'ASC'
    let condition = {
        category_id: req.params.id,
        status: true
    }

    if (req.query.sort) {
        if (req.query.sort == 'name') order[0] = ['name', by]
    } else order[0] = ['id', by]

    Category.findById(req.params.id).then( category => {
        if( !category ) return res.sendStatus(404)

        let meta = {
            categoryName: category.name,
        }

        Material.findAndCountAll({
            where: condition,
            include: [ 
                { model: User, attributes: ['name', 'id', 'username'] }
            ],
            attributes: ['id', 'name', 'user_id', 'description', 'url'],
            limit: limit,
            order: order,
            offset: offset,
        }).then((response) => {
            meta.totalPages = Math.ceil( response.count / limit )
            meta.totalItems = response.count
            
            if ( offset >= response.count ) {
                return res.status(200).send( { meta } )
            }
            res.status(200).send({ meta: meta, data: response.rows })
        })
    }).catch((err) => {
        res.sendStatus(500)
    })
}

function approve (req, res){
  if (req.user.usertype != 2) 
    return res.status(401).send({ error: 'No se encuentra autorizado' })
  
    
  Material.update(
    {
      status: true
    },
    {
      where: {
        id: req.params.id
      },
      fields: ['status']
    }
  ).then((affectedRows) => {
    if (affectedRows) return res.sendStatus(200)

    return res.status(400).send({ error: 'Datos incorrectos' })
  }).catch((err) => {
    return res.status(500).send({ error: `Ocurrió un error al autorizar el material: ${err}` })
  })

}

module.exports = {
    create,
    remove,
    approve,
    get,
    list,
    index,
    pending,
    update
}
