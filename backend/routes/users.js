'use strict'

const express = require('express')
const users = express.Router()
const authCtrl = require('../controllers/auth')
const userCtrl = require('../controllers/users')
const auth = require('../middlewares/auth')

/**
 * Handler for '/users' routes
 */

users.get('/', userCtrl.index )
users.post('/', userCtrl.register )
users.get('/:id/syllabus', userCtrl.getSyllabus )

module.exports = users;
