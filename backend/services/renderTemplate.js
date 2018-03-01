'use strict'

const fs = require('fs')
const path = require('path')

/**
 * Replace a set of values in a given template.
 * @param {any} filePath - 
 * @param {any} data[] - Bidimensional array [0] -> Value to be replaced, [1] -> New value
 * @param {any} callback
 */
function render( filePath, data, callback ){
    fs.readFile( path.join( __dirname, filePath ), (err, content) => {
        if(err) return callback(err)

        let template = content.toString();
        
        for( var i = 0; i < data.length; i++ ){
            var re = new RegExp(data[i][0], 'g')
            template = template.replace( re, data[i][1]);
        }

        return callback(null, template)
    })
}

module.exports = {
    render
}