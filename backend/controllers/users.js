'use strict'

const User = require('../models/users')
const Syllabus = require('../models/syllabuses')
const authService = require('../services/authenticationService')
const _ = require('lodash');

/**
 * Users controller 
 */

/**
 * List all the users
 * @param {any} req
 * @param {any} res
 */
function index(req, res) {
  User.findAll()
    .then((users) => {
      return res.status(200).send({ users })
    })
    .catch((err) => {
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

module.exports = {
  index,
  register,
  signUp,
  recovery,
  getSyllabus
}