'use strict'

const socket_io = require('socket.io');
const io = socket_io();
const User = require('../models').users
let contest = io.of('/contest')
let platform = io.of('/normal-mode')

var socketApi = {};

socketApi.io = io;

contest.on('connection', function(socket) {
    console.log('User in contest mode')
})

platform.on('connection', function(socket){
    socket.on('register', function( user_id ){
        addSocket( user_id, socket.id )
        console.log( 'Socket REGISTRO: ' + socket.id )
    })
    console.log('User in normal mode')
});

socketApi.notifySubmissionResult = function( user_id, problem_id, verdict ){
    getSocket( user_id, ( socket_id ) => {
        console.log( 'Socket ENVIO: ' + socket.id )
        platform.to(socket_id).emit('new result',{
            user_id: user_id,
            problem_id: problem_id,
            verdict: verdict
        })
    })
}

socketApi.refreshScoreboard = function( user_id, problem_id, verdict, submission_id ){
    contest.emit('new submission', {
        user_id: user_id,
        problem_id: problem_id,
        verdict: verdict,
        submission_id: submission_id
    })
}

function addSocket( user_id, socket_id ){
    User.update(
        { socket_id: socket_id},
        { where: { id: user_id } }
    ).then((affectedRows) => {
    }).catch((err) => {
    })
}

function getSocket( user_id, success ){
    User.findById( user_id )
    .then( (user) => {
        success( user.socket_id )
    })
    .catch( (err) => {
        console.log("Heyyy i'm an error")
        console.log( err )
    })
}

module.exports = socketApi;