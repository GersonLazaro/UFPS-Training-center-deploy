'use strict'

const multer = require('multer')
const path = require('path')
var crypto = require ('crypto')
var moment = require('moment')

var multer_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let d = 'inputs'

        if (file.fieldname == 'output') d = 'outputs'

        if (file.fieldname == 'pdf') d = 'materials'

        if (file.fieldname == 'code') d = 'codes'

        cb(null, path.join(__dirname, `../files/${d}`) )
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(8, function (err, raw) {
            if (err) return cb(err)
            let fieldname = file.originalname

            let ext = '.in'
            if (file.fieldname == 'output') ext = '.out'
            if( file.fieldname == 'input' || file.fieldname == 'output' ) 
                fieldname = raw.toString('hex') + moment() + ext
            if( file.fieldname == 'code' )
                fieldname = raw.toString('hex') + moment() + path.extname(file.originalname)

            cb(null, fieldname )
        })
    }
})

var problemsDataFilter = function (req, file, cb) {
    let ext = path.extname( file.originalname );
    
    if ( ext !== '.txt' && ext !== '.in' && ext !== '.out' ) {
        return cb( new Error('Sólo estan permitidos archivos .txt, .in y .out') )
    }
    cb(null, true)
}

var materialsDataFilter = function (req, file, cb) {
    let ext = path.extname( file.originalname );
    
    if ( ext !== '.pdf' ) {
        return cb( new Error('Sólo estan permitidos archivos .pdf') )
    }
    cb(null, true)
}

var submissionsDataFilter = function (req, file, cb) {
    let ext = path.extname( file.originalname );
    
    if ( ext !== '.cpp' && ext !== '.java' && ext !== '.py'  ) {
        return cb( new Error('Sólo estan permitidos archivos .cpp, .java y .py') )
    }
    cb(null, true)
}

module.exports = {
    multer_storage,
    problemsDataFilter,
    materialsDataFilter,
    submissionsDataFilter
};