'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config/config')
const Blacklist = require('../models').blacklist_tokens

/**
 * Validates the authorization token authenticity 
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns
 */
function isAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }
    
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.decode(token, config.SECRET_TOKEN)

        Blacklist.findOne({
            where: {
                token: token
            }
        }).then((token) => {
            if (token)
                return res.status(403).send({ error: 'Token Inválido' })

            if (payload.exp <= moment().unix()) {
                return res.status(403).send({ error: 'El token ha expirado' })
            }

            req.user = payload
            next()
        })
    } catch (err) {
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }
}

/**
 * Validates the recovery token authenticity 
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns
 */
function isRecovery( req, res, next){
    if (!req.body.token) {
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }

    try{
        const payload = jwt.decode(req.body.token, config.SECRET_TOKEN)

        Blacklist.findOne({
            where: {
                token: req.body.token
            }
        }).then( (token) => {
            if (token)
                return res.status(403).send({ error: 'Token Inválido' })

            if (payload.exp <= moment().unix()) {
                return res.status(403).send({ error: 'El token ha expirado' })
            }

            next();
        })
    }catch (err){
        return res.status(401).send({ error: 'No se encuentra autorizado' })
    }
}

module.exports = {
    isAuth,
    isRecovery
}