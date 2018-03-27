'use strict'

const Problem = require('../models').problems
const Submission = require('../models').submissions
const Category = require('../models').categories
const User = require('../models').users
const Grader = require('../controllers/grader')
const _ = require('lodash')
const files = require('../services/files')

/**
 * Problems controller 
 */

function create(req, res) {
    if (req.user.usertype == 0) {
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }

    req.body = req.body.data

    if ( (!req.body.title_es && !req.body.title_en) || (!req.body.description_en && !req.body.description_es)
        || !req.body.category || !req.body.level || !req.body.example_input || !req.body.example_output || !req.body.time_limit) {
        return res.status(400).send({ error: 'Datos incompletos' })
    }

    req.body.category_id = req.body.category
    req.body.input = req.files['input'][0].path
    req.body.output = req.files['output'][0].path
    req.body.user_id = req.user.sub

    Problem.create( req.body )
        .then(problem => {
            return res.sendStatus(201)
        })
        .catch(error => {
            error = _.omit(error, ['parent', 'original', 'sql'])
            return res.status(400).send(error)
        })
}

function update(req, res) {
    if (req.user.usertype == 0) {
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }

    let condition = {
        id: req.params.id
    }

    if (req.user.usertype == 1) {
        condition.user_id = req.user.sub
    }

    req.body.category_id = req.body.category

    if (req.files) {
        if (req.files['input']) req.body.input = req.files['input'][0].path
        if (req.files['output']) req.body.output = req.files['output'][0].path

        findFiles(req, res, condition)
    } else {
        makeUpdate(req, res, condition)
    }
}

function findFiles(req, res, condition) {
    Problem.findById(req.params.id).then(problem => {
        req.body.oldInput = problem.input
        req.body.oldOutput = proble.output

        makeUpdate(req, res, condition)
    }).catch((err) => {
        return res.sendStatus(500)
    })
}

function makeUpdate(req, res, condition) {
    Problem.update(
        req.body,
        {
            where: condition
        }
    ).then((affectedRows) => {
        if (affectedRows) {
            if (req.body.oldInput) files.removeFile(req.body.oldInput)
            if (req.body.oldOutput) files.removeFile(req.body.oldOutput)

            return res.status(200).send(req.body)
        }
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    }).catch((err) => {
        return res.sendStatus(500)
    })
}

function remove(req, res) {
    if (req.user.usertype == 0) {
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }

    let condition = {
        id: req.params.id
    }

    if (req.user.usertype == 1) {
        condition.user_id = req.user.sub
    }

    Problem.destroy({
        where: condition
    })
        .then(function (deletedRecords) {
            if (deletedRecords) return res.status(200).json(deletedRecords);
            return res.status(401).send({ error: 'No se encuentra autorizado' })
        })
        .catch(function (error) {
            return res.status(500).json(error);
        });
}

function get(req, res) {
    Problem.findOne({
        where: {
            id: req.params.id
        },
        include: [ { model: User, attributes: ['name', 'id', 'username', 'email'] } ],
        attributes: ['id', 'title_es', 'title_en', 'level', 'description_en', 'description_es',
            'example_input', 'example_output', 'category_id', 'user_id', 'time_limit']
    })
        .then((problem) => {
            return res.status(200).send({ problem })
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

    let condition = {}
    let meta = {}

    // Barra de búsqueda o búsqueda de problemas por categoria 
    if( req.params.id ) {
        condition.category_id = req.params.id
        if (req.query.filter) {
            if (req.query.filter == 'en') {
                condition.title_en = {
                    $ne: null
                }
            } else {
                condition.title_es = {
                    $ne: null
                }
            }
        }
    } else if( !req.query.search )
        return res.status(400).send({ error: 'No se ha proporcionado un termino para buscar' })
    else {
        req.query.search = '%' + req.query.search + '%'
        if (req.query.filter) {
            if (req.query.filter == 'en') {
                condition.title_en = {
                    $ne: null
                }

                condition.$or = [
                    { title_en: { $like: req.query.search } },
                    { description_en: { $like: req.query.search } }
                ]
            } else {
                condition.title_es = {
                    $ne: null
                }

                condition.$or = [
                    { title_es: { $like: req.query.search } },
                    { description_es: { $like: req.query.search } },
                ]
            }
        }else{
            condition.$or = [
                { title_en: { $like: req.query.search } },
                { title_es: { $like: req.query.search } },
                { description_en: { $like: req.query.search } },
                { description_es: { $like: req.query.search } },
            ]
        }
    }

    if (req.query.sort) {
        if (req.query.sort == 'name')
            if (req.query.filter && req.query.filter == 'es')
                order[0] = ['title_es', by]
            else order[0] = ['title_en', by]
        else
            order[0] = ['level', by]
    } else order[0] = ['id', by]

    if( req.params.id ){
        Category.findById(req.params.id).then( category => {
            if( !category ) return res.sendStatus(404)
    
            meta.categoryName = category.name
    
            Problem.findAndCountAll({
                where: condition,
                attributes: ['id', 'title_es', 'title_en', 'level', 'user_id'],
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
    } else {
        Problem.findAndCountAll({
            where: condition,
            attributes: ['id', 'title_es', 'title_en', 'level', 'user_id'],
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
        }).catch((err) => {
            res.sendStatus(500)
        })
    }
}

function submit(req, res) {
    if (req.user.usertype == 2)
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    req.body = req.body.data

    if( !req.files['code'] || !req.body.language )
        return res.status(400).send({ error: 'Datos incompletos' })
    
    req.body.user_id = req.user.sub
    req.body.problem_id = req.params.id
    req.body.file_name = req.files['code'][0].filename
    req.body.file_path = req.files['code'][0].path
    req.body.status = 'in queue'

    let isContest = false
    if( req.body.contest_problem_id ) isContest = true

    Submission.create( req.body )
        .then(submission => {
            Grader.judge( submission.id, isContest )
            return res.status(200).send(submission)
        })
        .catch(error => {
            error = _.omit(error, ['parent', 'original', 'sql'])
            return res.status(400).send(error)
        })
}

function submitAssignment(req, res) {
    if (req.user.usertype == 2)
        return res.status(401).send({ error: 'No se encuentra autorizado' })

    req.body = req.body.data

    if( !req.files['code'] || !req.body.language )
        return res.status(400).send({ error: 'Datos incompletos' })

    req.body.user_id = req.user.sub
    req.body.problem_id = req.params.id
    req.body.file_name = req.files['code'][0].filename
    req.body.file_path = req.files['code'][0].path
    req.body.status = 'in queue'

    let isContest = false
    if( req.body.contest_problem_id ) isContest = true

    Submission.create( req.body )
        .then(submission => {
            Grader.judge( submission.id, isContest )
            return res.status(200).send(submission)
        })
        .catch(error => {
            error = _.omit(error, ['parent', 'original', 'sql'])
            return res.status(400).send(error)
        })
}

function integrationTest( req, res ){
    Grader.judge( 1, true )
    res.sendStatus(200)
}


module.exports = {
    create,
    update,
    remove,
    list,
    get,
    submit,


    integrationTest
}
