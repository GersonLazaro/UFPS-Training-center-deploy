'use strict'

const express = require('express')
const users = express.Router()
const authCtrl = require('../controllers/auth')
const userCtrl = require('../controllers/users')
const auth = require('../middlewares/auth')

/**
 * Handler for '/users' routes
 */

users.get('/', auth.isAuth, userCtrl.index )
users.post('/', userCtrl.register )
users.get('/:id/syllabus', auth.isAuth, userCtrl.getSyllabus )
users.post('/remove-account', auth.isAuth, userCtrl.removeAccounts )
users.get('/ranking', auth.isAuth, userCtrl.getRanking )

module.exports = users;
