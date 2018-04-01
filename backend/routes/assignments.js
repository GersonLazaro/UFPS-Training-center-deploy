'use strict'

const express = require('express')
const Assignments = express.Router()
const assignmentsCtrl = require('../controllers/assignments')
const statisticsCtrl = require('../controllers/statistics')
const auth = require('../middlewares/auth')

/**
 * Handler for '/assignments' routes
 */

Assignments.get('/:id', auth.isAuth, assignmentsCtrl.get )
Assignments.get('/:id/results', auth.isAuth, statisticsCtrl.getAssignmentResult )
Assignments.get('/:id/submissions/:pid', auth.isAuth, assignmentsCtrl.getSubmissions )
Assignments.get('/:id/verdicts/:pid', auth.isAuth, statisticsCtrl.getAssignmentProbVerdicts )
Assignments.get('/:id/languages/:pid', auth.isAuth, statisticsCtrl.getAssignmentProbLanguages )
Assignments.post('/', auth.isAuth, assignmentsCtrl.create )
Assignments.post('/:id/add-problems', auth.isAuth, assignmentsCtrl.addProblems )
Assignments.post('/:id/remove-problems', auth.isAuth, assignmentsCtrl.deleteProblems )
Assignments.put('/:id', auth.isAuth, assignmentsCtrl.update)
Assignments.delete('/:id', auth.isAuth, assignmentsCtrl.remove )

module.exports = Assignments;