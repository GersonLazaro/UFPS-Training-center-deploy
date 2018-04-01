'use strict'

const express = require('express')
const syllabuses = express.Router()
const syllabusesCtrl = require('../controllers/syllabuses')
const auth = require('../middlewares/auth')
const materialsCtrl = require('../controllers/materials')
const statisticsCtrl = require('../controllers/statistics')

/**
 * Handler for '/syllabus' routes
 */

syllabuses.get('/', auth.isAuth, syllabusesCtrl.list )
syllabuses.get('/:id', auth.isAuth, syllabusesCtrl.get )
syllabuses.get('/:id/ranking', auth.isAuth, statisticsCtrl.getSyllabusRanking )
syllabuses.get('/:id/materials', auth.isAuth, syllabusesCtrl.getMaterials )
syllabuses.post('/:id/remove-materials', auth.isAuth, syllabusesCtrl.removeMaterialsFromSyllabus )
syllabuses.post('/:id/register', auth.isAuth, syllabusesCtrl.registerStudent )
syllabuses.post('/:id/delete-students', auth.isAuth, syllabusesCtrl.removeStudents )
syllabuses.post('/', auth.isAuth, syllabusesCtrl.create )
syllabuses.post('/:id/add-materials', auth.isAuth, syllabusesCtrl.assignMaterialsToSyllabus )
syllabuses.put('/:id', auth.isAuth, syllabusesCtrl.update )
syllabuses.delete('/:id', auth.isAuth, syllabusesCtrl.remove )

module.exports = syllabuses;
