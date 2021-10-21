//in package.json under -- "main": "index.js", -- add "type": "module",
import express from 'express';
import {Server} from 'socket.io';
import http from 'http';
import cors from 'cors';
import router from './routes/routes.js';
import { addUser, getUser, getUsersInRoom, removeUser } from './users.js';



// const express = require('express')
// const socketio = require('socket.io')
// const http = require('http')
// const cors = require('cors')
// const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')
// const path = require('path')

const PORT = process.env.PORT || 5000

const app = express();
const httpserver = http.createServer(app)
const io = new Server(httpserver)

app.use(cors());

var players= {};
var namedPlayers ={};
var games={};
const noNamePlaceHolder = "-----5"

app.use(router);

io.on('connection', socket => {
    console.log("A No Name PLayer is in the labby: ",socket.id)
    // players[socket.id]=noNamePlaceHolder
    
    socket.on('join', (payload, callback) => {
        let numberOfUsersInRoom = getUsersInRoom(payload.room).length

        const { error, newUser} = addUser({
            id: socket.id,
            name: numberOfUsersInRoom===0 ? 'Player 1' : 'Player 2',
            room: payload.room
        })

        if(error)
            return callback(error)

        socket.join(newUser.room)

        io.to(newUser.room).emit('roomData', {room: newUser.room, users: getUsersInRoom(newUser.room)})
        socket.emit('currentUserData', {name: newUser.name})
        callback()
    })

    socket.on("join-game", ({userName,roomName},callback)=>{
        console.log("Joining persons info:")
        const {error,newUser} = addUser({id:socket.id,name:userName,room:roomName})
        if(error){return callback(error)} //error handeling from adduser
        
        console.log(getUsersInRoom(newUser.room))
        socket.join(newUser.room);
    });

    socket.on('send-Move',(move)=>{
        const user = getUser(socket.id);
        console.log("-----","Sever recieving move from: ")
        console.log(user)
        console.log("the move is", move)
        
        console.log("Sending to everyone in this room")

        io.to(user.room).emit('recieve-Move',move);








    })

    socket.on('disconnect', () => {
        console.log("lost Connection with: ",socket.id)
        console.log("removing player");
        removeUser(socket.id)
        // delete players[socket.id];

        // console.log("Current remaining players",players)
        
    })

    socket.on('disconnecting',()=>{
        console.log("the rooms? =========")
        console.log(socket.rooms)

    })
})

httpserver.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});




/*

    socket.on('sendMessage', (payload, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', {user: user.name, text: payload.message})
        callback()
    })


        socket.on('initGameState', gameState => {
        const user = getUser(socket.id)
        if(user)
            io.to(user.room).emit('initGameState', gameState)
    })

    
    socket.on('updateGameState', gameState => {
        const user = getUser(socket.id)
        if(user)
            io.to(user.room).emit('updateGameState', gameState)
    })

        

        //serve static assets in production
        if(process.env.NODE_ENV === 'production') {
            //set static folder
            app.use(express.static('client/build'))
            app.get('*', (req, res) => {
                res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
            })
        }

        */
