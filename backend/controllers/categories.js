'use strict'

const Category = require('../models/categories')
const _ = require('lodash');

/**
 * Categories controller 
 */

/**
 * List all the users
 * @param {any} req
 * @param {any} res
 */
function index(req, res) {
    Category.findAll()
        .then((categories) => {
            return res.status(200).send({ categories })
        })
        .catch((err) => {
            return res.status(500).send({ error: `${err}` })
        })
}

function create(req, res) {
    if (req.user.usertype != 2) {
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }
    
    if( !req.body.name ){
        return res.status(400).send({ error: 'Datos incompletos' })
    }

    Category.create(req.body)
        .then(category => {
            return res.sendStatus(201)
        })
        .catch(error => {
            error = _.omit(error, ['parent', 'original', 'sql'])
            return res.status(400).send(error)
        })
}

function remove(req, res) {
    if (req.user.usertype != 2) {
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }

    Category.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(function (deletedRecords) {
            res.status(200).json( deletedRecords );
        })
        .catch(function (error) {
            res.status(500).json(error);
        });
}

function update(req, res) {
    if (req.user.usertype != 2) {
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }

    Category.update(
        {
            name: req.body.name,
        },
        {
            where: {
                id: req.params.id
            },
            fields: ['name']
        }
    ).then(( affectedRows ) => {
        if ( affectedRows ) return res.status(200).send( {id: req.params.id, name: req.body.name })

    }).catch((err) => {
        return res.sendStatus(500)
    })
}

module.exports = {
    index,
    create,
    remove,
    update
}
