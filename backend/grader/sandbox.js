'use strict'

const exec = require('child_process').exec
const Config = require('../grader/config.js')
const path = require('path')
const fs = require('fs')

class Sandbox {
  constructor (file_path, file_name, folder, time_limit, input, output, language, input_filename, output_filename) {
    this.file_path = file_path /* ruta del codigo a ejecutar */
    this.file_name = file_name /* nombre del archivo de codigo a ejecutar */
    this.folder = folder /* nombre de la carpeta temporal de la ejecucion */
    this.timeLimit = time_limit
    this.input = input /* ruta del archivo input */
    this.output = output /* ruta del archivo output */
    this.language = language
    this.input_filename = input_filename /* nombre del archivo input */
    this.output_filename = output_filename /* nombre del archivo output */
    this.path = path.dirname(__dirname)
    this.execution_directory = path.join( this.path, 'files', folder )
    this.config = new Config()
  }

  run (success) {
    this.setUpEnvironment(() => {
      this.execute(success)
    })
  }

  setUpEnvironment (success) {
    this.configureLanguage()
    exec(
      'mkdir ' + this.execution_directory + /* Crea la carpeta temporal */
      ' && cp ' + path.join(__dirname, 'util', this.runner) + ' ' + this.execution_directory + /* Copia los scripts al directorio */
      ' && chmod 777 ' + this.execution_directory + /* Asigna permisos a los scripts */
      ' && cp ' + path.join(this.path, this.input) + ' ' + this.execution_directory + /* Copia el input del problema */
      ' && cp ' + path.join(this.path, this.output) + ' ' + this.execution_directory + /* Copia el output del problema */
      ' && cp ' + path.join(this.path, this.file_path) + ' ' + this.execution_directory + /* Copia el source del usuario */
      ' && mv ' + this.execution_directory + '/' + this.file_name + ' ' + this.execution_directory + '/' + this.fileName + /* Renombrar el fuente para poderlo ejecutar */
      " && sed -i '' 's/{TL}/" + this.timeLimit + "/g' " + this.execution_directory + '/' + this.runner + /* Reemplazo del TL en el script de shell  */
      " && sed -i '' 's/{path}/\\/files\\/" + this.folder + '\\/' + "/g' " + this.execution_directory + '/' + this.runner + /* Reemplazo del path del archivo a ejecutar en el script de shell  */
      " && sed -i '' 's/{code}/" + this.executionFile + "/g' " + this.execution_directory + '/' + this.runner + /* Reemplazo del archivo a ejecutar en el script de shell  */
      " && sed -i '' 's/{input}/\\/files\\/" + this.folder + '\\/' + this.input_filename + "/g' " + this.execution_directory + '/' + this.runner + /* Reemplazo del archivo de entradas en el script de shell  */
      " && sed -i '' 's/{folder}/" + this.folder + "/g' " + this.execution_directory + '/' + this.runner /* Reemplazo de la carpeta en el script de shell  */
      , (error, stdout, stderr) => {
            if (error) {
                console.log( stderr )
                this.removeExecutionFolder()
            } else success()
        }
    )
  }

  configureLanguage () {
    for( let i = 0; i < this.config.langs.length; i++ ){
      if( this.language === this.config.langs[i] ) this.languageId = i
    }

    this.executionFile = this.config.executionFilename[ this.languageId ]
    this.fileName = this.config.filename[ this.languageId]
    this.runner = this.config.runners[ this.languageId ]
  }

  execute (success) {
    let compiler = this.config.compilers[this.languageId]
    compiler = compiler.replace(/{folder}/g, this.folder)
    let container = this.config.containers[this.languageId]
    let ins = 'docker exec ' + container + ' ' + compiler

    //console.log( ins )
    exec(ins, (error, stdout, stderr) => {
      if (error) {
        success('Compilation Error', '0')
        this.removeExecutionFolder()
        return
      }
      exec('docker exec ' + container + ' /files/' + this.folder + '/' + this.runner + '  ' + this.timeLimit, (error, stdout, stderr) => {
        let ans = stdout.split('\n')[0]
        let tmp = stderr.split('\n')
        let execTime
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i].length === 0) continue
          else if (tmp[i].substr(0, 4) === 'real') {
            execTime = tmp[i].substr(7, 5)
            break
          }
        }

        if (ans === 'Timelimit') {
          success('Time Limit Exceeded', this.timeLimit)
          this.removeExecutionFolder()
        } else if (ans === 'Runtime') {
          success('Runtime Error', execTime)
          this.removeExecutionFolder()
        } else this.validateOutput(execTime, success)
      })
    })
  }

  validateOutput (execTime, success) {
    exec('diff ' + path.join(this.execution_directory, 'output.out') + ' ' + path.join(this.execution_directory, this.output_filename), (error, stdout, stderr) => {
      if (error) success('Wrong Answer', execTime)
      else success('Accepted', execTime)
      this.removeExecutionFolder()
    })
  }

  

  removeExecutionFolder () {
    exec(
      'rm -rf ' + this.execution_directory /* Elimina la carpeta temporal de la ejecución */
    )
  }
}

module.exports = Sandbox
