'use strict';

const nodemailer = require("nodemailer")

/**
 * Mailer Utility
 * Module for handling everything related to the sending of emails
 */

/**
 * Instance a transportation method with the given configuration options
 * @returns
 */
function createTransport() {
  /*if (process.env.USE_SMTP_XOAUTH2) {
        let generator = require('xoauth2').createXOAuth2Generator({
          user: process.env.SMTP_USER,
          clientId: process.env.XOAUTH2_CLIENT_ID,
          clientSecret: process.env.XOAUTH2_CLIENT_SECRET,
          refreshToken: process.env.XOAUTH2_REFRESH_TOKEN
        });
  
        return nodemailer.createTransport({
          service: "gmail",
          auth: {
            xoauth2: generator
          }
        });
      }
      return nodemailer.createTransport({
        'host': process.env.SMTP_HOST,
        'secureConnection': !!process.env.SMTP_USE_SSL,
        'secure': !!process.env.SMTP_USE_SSL,
        'port': process.env.SMTP_PORT,
        'auth': {
          'user': process.env.SMTP_USER,
          'pass': process.env.SMTP_PASSWORD
        }
      });*/

  return nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })
}

/**
 * Sends an email with the options given and the configuration settle.
 * @param {any} options - Message info
 * @param {any} cb
 * @returns
 */
function send(options, cb) {
  return createTransport().sendMail(options, cb)
}

module.exports = {
  send
}