'use strict'

const express = require('express')
const contests = express.Router()
const contestsCtrl = require('../controllers/contests')
const auth = require('../middlewares/auth')

/**
 * Handler for '/contests' routes
 */

contests.post('/', auth.isAuth, contestsCtrl.create )
contests.get('/', auth.isAuth, contestsCtrl.list )
contests.get('/:id', auth.isAuth, contestsCtrl.index )
contests.put('/:id', auth.isAuth, contestsCtrl.update )
contests.delete('/:id', auth.isAuth, contestsCtrl.remove )
contests.get('/:id/problems', auth.isAuth, contestsCtrl.getProblems )
contests.post('/:id/problems', auth.isAuth, contestsCtrl.addProblems )
contests.post('/:id/remove-problems', auth.isAuth, contestsCtrl.removeProblems )
contests.post('/:id/register', auth.isAuth, contestsCtrl.registerStudent )
contests.post('/:id/unregister', auth.isAuth, contestsCtrl.removeStudent )

contests.get('/:id/results', auth.isAuth, contestsCtrl.getScoreboard )

module.exports = contests;
