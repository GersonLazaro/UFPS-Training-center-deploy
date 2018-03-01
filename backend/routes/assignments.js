'use strict'

const express = require('express')
const Assignments = express.Router()
const assignmentsCtrl = require('../controllers/assignments')
const auth = require('../middlewares/auth')

/**
 * Handler for '/assignments' routes
 */

Assignments.post('/', auth.isAuth, assignmentsCtrl.create )
Assignments.put('/:id', auth.isAuth, assignmentsCtrl.update)
Assignments.delete('/:id', auth.isAuth, assignmentsCtrl.remove )
Assignments.get('/:id', auth.isAuth, assignmentsCtrl.get )
Assignments.post('/:id/add-problems', auth.isAuth, assignmentsCtrl.addProblems )
Assignments.post('/:id/remove-problems', auth.isAuth, assignmentsCtrl.deleteProblems )

module.exports = Assignments;