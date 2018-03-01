'use strict';

const fs = require('fs')

/**
 * Files Utility
 */

function removeFile (filePath) {
    fs.unlinkSync(filePath)
}

module.exports = {
  removeFile
}