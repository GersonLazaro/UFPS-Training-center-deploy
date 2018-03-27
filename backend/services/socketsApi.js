'use strict'

const socket_io = require('socket.io');
const io = socket_io();
const User = require('../models').users
let contest = io.of('/contest')
let platform = io.of('/normal-mode')

var socketApi = {};

socketApi.io = io;

contest.on('connection', function(socket) {
    console.log('***********************************************'
                +'**********************************************'
                +'**********************************************'
                +'**********************************************'
                +'**********************************************'
                +'              REGISTRO - MARATON              '
                +'**********************************************'
                +'**********************************************'
                +'**********************************************'
                +'**********************************************'
            )
})

platform.on('connection', function(socket){
    socket.on('register', function( user_id ){
        addSocket( user_id, socket.id )
    })
});

socketApi.notifySubmissionResult = function( user_id, problem_id, verdict, problem_name ){
    getSocket( user_id, ( socket_id ) => {
        console.log( 'Socket ENVIO: ' + socket_id )
        platform.to(socket_id).emit('new result',{
            user_id: user_id,
            problem_id: problem_id,
            verdict: verdict,
            problem_name: problem_name
        })
    })
}

socketApi.refreshScoreboard = function( user_id, problem_id, verdict, submission_id, problem_name ){
    console.log('***********************************************'
                +'**********************************************'
                +'**********************************************'
                +'**********************************************'
                +'**********************************************'
                +'                   CONTEST                    '
                +'**********************************************'
                +'**********************************************'
                +'**********************************************'
                +'**********************************************'
            )
    contest.emit('new submission', {
        user_id: user_id,
        problem_id: problem_id,
        verdict: verdict,
        submission_id: submission_id, 
        problem_name: problem_name
    })
}

function addSocket( user_id, socket_id ){
    User.update(
        { socket_id: socket_id},
        { where: { id: user_id } }
    ).then((affectedRows) => {
    }).catch((err) => {
        console.log('ADD SOCKET ERROR: ' + err )
    })
}

function getSocket( user_id, success ){
    User.findById( user_id )
    .then( (user) => {
        success( user.socket_id )
    })
    .catch( (err) => {
        console.log('GET SOCKET ERROR: ' + err )
    })
}

module.exports = socketApi;