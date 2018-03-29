'use strict'

const express = require('express')
const users = express.Router()
const authCtrl = require('../controllers/auth')
const userCtrl = require('../controllers/users')
const statisticsCtrl = require('../controllers/statistics')
const auth = require('../middlewares/auth')

/**
 * Handler for '/users' routes
 */

users.get('/', auth.isAuth, userCtrl.index )
users.post('/', userCtrl.register )
users.get('/:id/syllabus', auth.isAuth, userCtrl.getSyllabus )
users.get('/:id/submissions', auth.isAuth, userCtrl.getSubmissions )
users.post('/remove-account', auth.isAuth, userCtrl.removeAccounts )
users.get('/ranking', auth.isAuth, statisticsCtrl.getRanking )

module.exports = users;
