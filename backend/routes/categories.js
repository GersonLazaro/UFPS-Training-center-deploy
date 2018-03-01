'use strict'

const express = require('express')
const categories = express.Router()
const categoriesCtrl = require('../controllers/categories')
const problemsCtrl = require('../controllers/problems')
const materialsCtrl = require('../controllers/materials')
const auth = require('../middlewares/auth')

/**
 * Handler for '/categories' routes
 */

categories.get('/', auth.isAuth, categoriesCtrl.index )
categories.post('/', auth.isAuth, categoriesCtrl.create )
categories.put('/:id', auth.isAuth, categoriesCtrl.update )
categories.delete('/:id', auth.isAuth, categoriesCtrl.remove )
categories.get('/:id/problems', auth.isAuth, problemsCtrl.list )
categories.get('/:id/materials', auth.isAuth, materialsCtrl.list )


module.exports = categories;
