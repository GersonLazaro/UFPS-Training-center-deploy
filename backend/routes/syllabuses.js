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

syllabuses.post('/', auth.isAuth, syllabusesCtrl.create )
syllabuses.get('/:id', auth.isAuth, syllabusesCtrl.get )
syllabuses.get('/', auth.isAuth, syllabusesCtrl.list )
syllabuses.delete('/:id', auth.isAuth, syllabusesCtrl.remove )
syllabuses.put('/:id', auth.isAuth, syllabusesCtrl.update )
syllabuses.post('/:id/add-materials', auth.isAuth, syllabusesCtrl.assignMaterialsToSyllabus )
syllabuses.get('/:id/materials', auth.isAuth, syllabusesCtrl.getMaterials )
syllabuses.post('/:id/remove-materials', auth.isAuth, syllabusesCtrl.removeMaterialsFromSyllabus )
syllabuses.post('/:id/register', auth.isAuth, syllabusesCtrl.registerStudent )
syllabuses.post('/:id/delete-students', auth.isAuth, syllabusesCtrl.removeStudents )
syllabuses.get('/:id/ranking', auth.isAuth, statisticsCtrl.getSyllabusRanking )

module.exports = syllabuses;
