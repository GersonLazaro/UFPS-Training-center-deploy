'use strict'

const authService = require('../services/authenticationService')
const User = require('../models').users
const Mailer = require('../services/mailer')
const ViewRender = require('../services/renderTemplate')

/**
 * Authentication Controller
 */

/**
 * Authenticate a user
 * @param {any} req
 * @param {any} res
 */
function signIn(req, res) {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ error: 'Datos incompletos' })
    }

    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(function (user) {
        if (user.authenticate(req.body.password))
            res.status(200).send({ token: authService.createToken(user) })
        else
            res.status(401).send({ error: 'Contraseña incorrecta' })

    }).catch(function (err) {
        res.status(401).send({ error: 'Email incorrecto' })
    })
}

/**
 * Sends an email for the recovery password process
 * @param {any} req
 * @param {any} res
 */
function recovery(req, res) {
    //url imagen: src="https://dl.dropboxusercontent.com/s/6kcxyp2o1tb7zgj/bg.jpg?dl=0"
    let options = {
        from: process.env.FROM_ACCOUNT,
        to: req.query.email,
        subject: 'Recuperación de contraseña'
    };

    User.findOne({
        where: {
            email: req.query.email
        }
    }).then(function (user) {
        let token = authService.getRecoveryToken(user);
        let data = [['{{link}}', `/#/cambiar-password/${token}`]]

        ViewRender.render('../common/templates/recovery.html', data, (err, view) => {
            if (err) return res.sendStatus(500)

            options.html = view

            Mailer.send(options, (success) => {
                return res.sendStatus(200)
            }, (err) => {
                if (err)
                    //console.log(err)
                    return res.sendStatus(500)
            })
        })

    }).catch(function (err) {
        res.status(401).send({ error: `${err}` })
    })
}

module.exports = {
    signIn,
    recovery
}