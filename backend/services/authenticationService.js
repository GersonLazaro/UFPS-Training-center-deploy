'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config/config')
const Blacklist = require('../models').blacklist_tokens

/**
 * Token Authentication Handler
 */

/**
 * Creates a new authentication token
 * @param {any} user
 * @returns
 */
function createToken(user) {
    const payload = {
        sub: user.id,
        username: user.username,
        usertype: user.type,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    }

    return jwt.encode( payload, config.SECRET_TOKEN )
}

/**
 * Creates a new recovery password token
 * @param {any} user
 * @returns
 */
function getRecoveryToken(user) {
    const payload = {
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(1, 'hour').unix(),
    }

    return jwt.encode(payload, config.SECRET_TOKEN)
}

/**
 * Invalidates a given token
 * @param {any} token
 */
function invalidateToken(token) {
    Blacklist.create({ token: token, exp_date: moment().unix() })
        .then( invalidate => {
            return true
        })
        .catch(error => {
            return false
        })
}

module.exports = {
    createToken,
    getRecoveryToken,
    invalidateToken
}