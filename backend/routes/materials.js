'use strict'

const express = require('express')
const materials = express.Router()
const materialsCtrl = require('../controllers/materials')
const auth = require('../middlewares/auth')
const multer = require('multer')
const uploader = require('../services/uploader')

var upload = multer({
    storage: uploader.multer_storage,
    fileFilter: uploader.materialsDataFilter
})

var materialUpload = upload.fields([
    { name: 'pdf', maxCount: 1 }
])

/**
 * Handler for '/materials' routes
 */

materials.get('/', materialsCtrl.index )
materials.post('/', auth.isAuth, materialUpload, materialsCtrl.create )
materials.delete('/:id', auth.isAuth, materialsCtrl.remove )
materials.get('/pending', auth.isAuth, materialsCtrl.pending )
materials.get('/:id', materialsCtrl.get )
materials.patch('/:id', auth.isAuth, materialsCtrl.approve )
materials.put('/:id', auth.isAuth, materialUpload, materialsCtrl.update )


module.exports = materials;
