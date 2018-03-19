'use strict'

const Problem = require('../models').problems
const Submission = require('../models').submissions
const Sandbox = require('../grader/sandbox')
const _ = require('lodash')
const crypto = require ('crypto')
const path = require('path')
const socket = require('../services/socketsApi')

/**
 * Grader controller 
 */

function judge( submission_id, contest ) {
    getSubmissionData( submission_id, (res) =>{
        let data = res
        getProblemData( data, () => {
            //url de la ruta donde se almaceno el archivo desde /files
            var n = data.file_path.indexOf('/files')
            let file_path = data.file_path.substring(n, data.file_path.length )
            //url de la ruta donde esta el input desde /files
            n = data.input.indexOf('/files')
            let input_path = data.input.substring(n, data.input.length )
            //url de la ruta donde esta el output desde /files
            n = data.output.indexOf('/files')
            let output_path = data.output.substring(n, data.output.length )
            //Directorio temporal de la ejecución
            let folder = crypto.randomBytes(24).toString('hex')
            let input_filename = path.basename( data.input )
            let output_filename = path.basename( data.output )

            let execution = new Sandbox(
                file_path,
                data.file_name,
                folder,
                data.time_limit,
                input_path,
                output_path,
                data.language,
                input_filename,
                output_filename
            )

            //VALIDAR QUE LOS CONTENEDORES ESTEN ARRIBA!!! ANTES DE ENVIAR A EJECUTAR
            updateStatus( submission_id, { status: 'running'} )

            execution.run( (verdict, executionTime) => {
                console.log( verdict )
                let data = {
                    status: 'executed',
                    execution_time: executionTime,
                    verdict: verdict
                }
                updateStatus( submission_id, data )
                //user, problem, verdict, sumission_id
                if( contest ) socket.refreshScoreboard(1,1,'Wrong Answer', 1)
                //user, problem, verdict
                else socket.notifySubmissionResult( 1, 1, 'Acc')
            })
        })
    })
}

function getSubmissionData( submission_id, cb ){
    Submission.findOne({
        where: { id: submission_id },
        attributes: ['problem_id', 'file_name', 'file_path', 'language']
    }).then( ( submission ) =>{
        let data = {
            problem_id: submission.problem_id,
            file_name: submission.file_name,
            file_path: submission.file_path,
            language: submission.language
        }
        cb( data )
    }).catch( (err) => {
        console.log( "Error trayendo el envio")
    } )
}

function getProblemData( data, cb ){
    Problem.findOne({
        where: { id: data.problem_id },
        attributes: ['input', 'output', 'time_limit']
    }).then( ( problem ) =>{
        data.input = problem.input
        data.output = problem.output
        data.time_limit = problem.time_limit
        cb()
    }).catch( (err) => {
        console.log( "Error trayendo el problema")
    } )
}

function updateStatus( submission_id, data ){
    Submission.update(
        data,
        {
            where: { id: submission_id }
        }
    ).catch((err) => {
        console.log('Ocurrió un error actualizando el estado del envio')
    })
}

module.exports = {
    judge
}
