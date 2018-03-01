'use strict'

const express = require('express')
const problems = express.Router()
const problemsCtrl = require('../controllers/problems')
const auth = require('../middlewares/auth')
const multer = require('multer')
const uploader = require('../services/uploader')

var upload = multer({
    storage: uploader.multer_storage,
    fileFilter: uploader.problemsDataFilter
})

var problemUpload = upload.fields([
    { name: 'input', maxCount: 1 },
    { name: 'output', maxCount: 1 }
])

var submission = multer({
    storage: uploader.multer_storage,
    fileFilter: uploader.submissionsDataFilter
})

var submissionUpload = submission.fields([
    { name: 'code', maxCount: 1 }
])

/**
 * Handler for '/problems' routes
 */

problems.post('/', auth.isAuth, problemUpload, problemsCtrl.create )
problems.put('/:id', auth.isAuth, problemUpload, problemsCtrl.update)
problems.delete('/:id', auth.isAuth, problemsCtrl.remove )
problems.get('/:id', auth.isAuth, problemsCtrl.get )
problems.post('/:id/submit', auth.isAuth, submissionUpload, problemsCtrl.submit )
problems.get('/', auth.isAuth, problemsCtrl.list )


problems.post('/prueba-calificador', problemsCtrl.integrationTest )

module.exports = problems;
