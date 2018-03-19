'use strict'

const User = require('../models').users
const Submissions = require('../models').submissions
const Syllabus = require('../models').syllabuses
const authService = require('../services/authenticationService')
const _ = require('lodash');
const Sequelize = require('sequelize');
var sequelize = new Sequelize('development', 'root', 'root');
/**
 * Users controller 
 */

function removeAccounts(req, res){
  if( req.user.usertype != 2 )
    return res.status(401).send({ error: 'No se encuentra autorizado' })
  
  if( !req.body.users )
    return res.status(400).send({ error: 'Datos incompletos' })
  
    User.destroy({
      where: {
        id: req.body.users
      }
    })
    .then(function (deletedRecords) {
          return res.status(200).json(deletedRecords);
    })
    .catch(function (error) {
        return res.status(500).json(error);
    });
}
/**
 * List all the users
 * @param {any} req
 * @param {any} res
 */
function index(req, res) {
  if( req.user.usertype != 2 )
    return res.status(401).send({ error: 'No se encuentra autorizado' })

  let limit = (req.query.limit) ? parseInt(req.query.limit) : 10
  let offset = (req.query.page) ? limit * ( parseInt(req.query.page) - 1 ) : 0

  let condition = {}
  let meta = {}

  if( req.query.type )
      condition.type = req.query.type
  else
      condition.id = { $ne: null }
      
  User.findAndCountAll({
      where: condition,
      attributes: ['id', 'name', 'email', 'code', 'type', 'username'],
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

/**
 * Registers an student user 
 * @param {any} req
 * @param {any} res
 */
function register(req, res) {
  req.body.type = 0

  User.create(req.body)
    .then(user => {
      return res.sendStatus(201)
    })
    .catch(error => {
      error = _.omit(error, ['parent', 'original', 'sql'])
      return res.status(400).send(error)
    })
}

/**
 * Register an Admin or Coach user
 * @param {any} req
 * @param {any} res
 * @returns
 */
function signUp(req, res) {
  if (req.user.usertype != 2 || req.body.type == 0) {
    return res.status(401).send({ error: 'No se encuentra autorizado' })
  }

  User.create(req.body)
    .then(user => {
      return res.sendStatus(201)
    })
    .catch(error => {
      error = _.omit(error, ['parent', 'original', 'sql'])
      return res.status(400).send(error)
    })
}

/**
 * Updates the user's password
 * @param {any} req
 * @param {any} res
 * @returns
 */
function recovery(req, res) {
  if (!req.body.email || !req.body.password || !req.body.confirmPassword) {
    return res.status(400).send({ error: 'Datos incompletos' })
  }

  authService.invalidateToken(req.body.token)

  User.update(
    {
      password: req.body.password,
      confirm_password: req.body.confirmPassword
    },
    {
      where: {
        email: req.body.email
      },
      fields: ['password', 'confirm_password'],
      individualHooks: true
    }
  ).then((affectedRows) => {
    if (affectedRows) return res.sendStatus(200)

    return res.status(400).send({ error: 'Datos incorrectos' })
  }).catch((err) => {
    return res.status(500).send({ error: `Ocurrió un error al restablecer la contraseña: ${err}` })
  })
}

function getSyllabus (req,res){
  User.findOne({
       where: {id : req.params.id },
       attributes: ['id'],
       include: [ 
        {
          model: Syllabus,
          as: 'syllabuses',
          attributes: ['id'],
          through: { attributes: [] }
        } 
      ]
  }).then( (ans) => {
      if( ans == null ) return res.sendStatus(404)
      let user = {}
      user.id = ans.id
      user.syllabuses = ans.syllabuses.map( s => s.id )
      return res.status(200).send({ user })
  }).catch( (err) => {
      return res.status(500).send({ error: `${err}` })
  })
}

function getRanking(req, res) {
  let limit = (req.query.limit) ? parseInt(req.query.limit) : 10
  let offset = (req.query.page) ? limit * ( parseInt(req.query.page) - 1 ) : 0

  let condition = {}
  let meta = {}

  if( req.query.type )
      condition.type = req.query.type
  else
      condition.id = { $ne: null }
      
  sequelize.query(
    'SELECT u.username, COUNT(s.problem_id) as total, '
    +'(SELECT COUNT( DISTINCT(problem_id) ) '
    +'FROM submissions '
    +'WHERE verdict="Accepted" '
    +'AND s.assignment_problem_id IS NULL '
    +'AND s.contest_problem_id IS NULL '
    +'AND user_id = u.id) as accepted '
    +'FROM users u, submissions s '
    +'WHERE s.user_id = u.id '
    +'AND s.assignment_problem_id IS NULL '
    +'AND s.contest_problem_id IS NULL',
    { type: Sequelize.QueryTypes.SELECT}
  ).then( users => {
    console.log( users )
    return res.status(200).send(users)
  })
}

module.exports = {
  index,
  register,
  signUp,
  recovery,
  getSyllabus,
  removeAccounts,
  getRanking
}