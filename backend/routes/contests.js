'use strict'

const express = require('express')
const contests = express.Router()
const contestsCtrl = require('../controllers/contests')
const auth = require('../middlewares/auth')
const statisticsCtrl = require('../controllers/statistics')

/**
 * Handler for '/contests' routes
 */

contests.get('/', auth.isAuth, contestsCtrl.list )
contests.get('/:id', auth.isAuth, contestsCtrl.index )
contests.get('/:id/problems', auth.isAuth, contestsCtrl.getProblems )
contests.get('/:id/is-register', auth.isAuth, contestsCtrl.isRegister )
contests.get('/:id/results', auth.isAuth, statisticsCtrl.getContestScoreboard )
contests.post('/', auth.isAuth, contestsCtrl.create )
contests.post('/:id/problems', auth.isAuth, contestsCtrl.addProblems )
contests.post('/:id/remove-problems', auth.isAuth, contestsCtrl.removeProblems )
contests.post('/:id/register', auth.isAuth, contestsCtrl.registerStudent )
contests.post('/:id/unregister', auth.isAuth, contestsCtrl.removeStudent )
contests.put('/:id', auth.isAuth, contestsCtrl.update )
contests.delete('/:id', auth.isAuth, contestsCtrl.remove )

module.exports = contests;
