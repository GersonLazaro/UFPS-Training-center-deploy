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
users.get('/:id', auth.isAuth, userCtrl.getUser )
users.get('/:id/syllabus', auth.isAuth, userCtrl.getSyllabus )
users.get('/:id/submissions', auth.isAuth, userCtrl.getSubmissions )
users.get('/ranking', auth.isAuth, statisticsCtrl.getRanking )
users.get('/:id/languages', auth.isAuth, statisticsCtrl.getLanguagesStatistic )
users.get('/:id/verdicts', auth.isAuth, statisticsCtrl.getVerdictsStatistic )
users.post('/', userCtrl.register )
users.post('/remove-account', auth.isAuth, userCtrl.removeAccounts )
users.post('/:id/update-password', auth.isAuth, userCtrl.changePassword )
users.put('/:id', auth.isAuth, userCtrl.update )

module.exports = users;
