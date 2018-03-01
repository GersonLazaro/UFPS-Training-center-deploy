'use strict'

const express = require('express')
const router = express.Router()

const users = require('../routes/users')
const categories = require('../routes/categories')
const problems = require('../routes/problems')
const materials = require('../routes/materials')
const syllabuses = require('../routes/syllabuses')
const assignments = require('../routes/assignments')
const contests = require('../routes/contests')

const auth = require('../middlewares/auth')
const authCtrl = require('../controllers/auth')
const userCtrl = require('../controllers/users')

/**
 * Routes Handler
 */

router.use('/users', users)
router.use('/categories', categories)
router.use('/problems', problems)
router.use('/materials', materials)
router.use('/syllabus', syllabuses)
router.use('/assignments', assignments)
router.use('/contests', contests)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send({ message: "hello world" });
});

/* GET */
router.get('/recovery', authCtrl.recovery )

/* POST */
router.post('/super-user', auth.isAuth, userCtrl.signUp )
router.post('/auth', authCtrl.signIn )

/* PATCH */
router.patch('/reset', auth.isRecovery, userCtrl.recovery )

module.exports = router;
