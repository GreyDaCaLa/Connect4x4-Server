//in package.json under -- "main": "index.js", -- add "type": "module",
import express from 'express';
import {Server} from 'socket.io';
import http from 'http';
import cors from 'cors';
import router from './routes/routes.js';
import { createUser, loginUser, userAddRoom, getUser, userRemoveRoom } from './zUsers.js';
import { createGame, getFullGameContent, getPlayersInGame, addPlayerToGame, putMoveOnBoard, removePlayerFromGame } from './zGames.js';

const PORT = process.env.PORT || 5000

const app = express();
const httpserver = http.createServer(app)
const io = new Server(httpserver)

app.use(cors());


app.use(router);

io.on('connection', socket => {
    console.log("A No Name PLayer is in the lobby: ",socket.id)
    

    socket.on("Create_User", (CreateName,CreatePass,callback)=>{
        console.log("-----Create-User--",CreateName)

        let { newUser, error }= createUser(CreateName,CreatePass)
        if(error){
            // console.log(error);
            return callback(error);
        }
        if(newUser){
            // console.log("Made a new user:",newUser)
            io.to(socket.id).emit('CreateUser_Ack',newUser)
        }
    });

    socket.on("Login_User", (name,pass,callback)=>{
        console.log("-----Login-User---",name)

        let send_User

        let { user, error }= loginUser(name,pass)
        if(error){return callback(error)}
        if(user){
            // console.log("Loggin in user:",user)
            send_User = {...user}

            send_User.rooms = roomCardContent(user.rooms,user.name)
            // console.log("Loggin in user after:",send_User)
            io.to(socket.id).emit('LoginUser_Ack',send_User)
        }
    });

    socket.on("UpdatePlayerInfo_RQ",(pname)=>{
        let send_User

        // console.log("\n\n----Update player info")
        let user = getUser(pname)
        send_User = {...user}
        // console.log(user)
        send_User.rooms= roomCardContent(user.rooms,user.name)
        // console.log(send_User)

        io.to(socket.id).emit('Up_RES', send_User)
        // io.to(socket.id).emit("WhereAreYou","I AM HERE MAYBE")

        // console.log("WHY DOES IT NOT HAPPEN-------")
    });

    socket.on("Create_NewGame", (createRoomName,createRoomMode,madebyname,callback)=>{
        console.log("-----Create_Game");
        
        let {newGame,error} = createGame(createRoomName,createRoomMode,madebyname);
        if(error){return callback(error)}
        if(newGame){

            // console.log("Made a new Game:",newGame);
            let test1 = userAddRoom(madebyname,newGame["name"]);
            // console.log("test1")
            // console.log(test1)

            io.to(socket.id).emit('Create_NewGame_Ack', newGame["name"] );

        }


    })

    socket.on("gameRQ_FullContent",(gameRoomName, callback)=>{
        console.log("-------------FullConetent was requesteed")

        let { fullGame, error } = getFullGameContent(gameRoomName)
        if(error){return callback(error)}
        if(fullGame){

            // console.log("Got Game:",fullGame);

            io.to(socket.id).emit('gameRES_FullContent', fullGame );

        }
    })

    socket.on("GameRQ_DoesExist", (searchedGameName,callback)=>{
        console.log("---Game Exist?")
        let { fullGame, error } = getFullGameContent(searchedGameName)
        if(error){
            console.log("error game was not found--",searchedGameName)
            return callback(error)
        }
        if(fullGame){
            console.log("Game Was Found");
            if(fullGame.full){
                console.log("Game Was Full")
                io.to(socket.id).emit('gameRES_DoesExistIsFull',fullGame.name)
            }
            else{
                io.to(socket.id).emit('gameRES_DoesExist', fullGame.name )
            }
        }
    })

    socket.on('Join_Game', (playerName,gameName,callback)=>{
        console.log("----Join_game")
        let fixedGameName = gameName.trim().toLowerCase();
        let alreadyIn=false
        let {playersInGame ,error} = getPlayersInGame(fixedGameName)

        if(error){return callback(error)}
        if(playersInGame){

            // console.log(`All current player in room ${gameName}:`,playersInGame);

            for(let i =0;i<playersInGame.length;i++ ){
                if(playersInGame[i] == playerName){
                    // player is comming back to the game i geuss
                    // add player to room with same name as the game
                    // assign respective player number to this player session
                    socket.join(fixedGameName)
                    io.to(socket.id).emit('AssignPlayer_Number',i+1)
                    alreadyIn =true
                }
            }

            //made sure player wasn't already a apart of the game
            //assigning new player number if possible
            //updating game of new player
            for(let i =0;i<playersInGame.length && !alreadyIn;i++ ){
                if(playersInGame[i] == ""){
                    // empty plyer slot found
                    
                    let newplayersInGame = addPlayerToGame(playerName,fixedGameName,i)
                    userAddRoom(playerName,fixedGameName)
                    io.to(socket.id).emit('AssignPlayer_Number',i+1)
                    io.to(fixedGameName).emit('newPlayer_Joining',newplayersInGame)
                    socket.join(gameName)
                    alreadyIn =true
                }
            }

            if(!alreadyIn){
                // error = { error:"Sorry!!, But This game is full search for another." }
                return callback("Sorry!!, But This game is full search for another.")
            }

            
            

        }

    })

    socket.on('Leave_Game',(gameName,pname,gwin)=>{
        console.log("------Leaving Game")
        // console.log("Person Leaving: ",playerName)
        // console.log("leaving room: ",gameName)
        // console.log(socket.rooms)
        socket.leave(gameName)
        // console.log(socket.rooms)

        if(gwin){
            //player saw game end
            //remove player from game and game from player
            handleGameOverCleanUp(gameName,pname)
        }


    })

    socket.on('SEND_Move',(gameName, move)=>{
        console.log("-------Send Move")
        // console.log("the room is: ",gameName)
        // console.log("the move is", move)

        // console.log("Updating GameBoard")
        const {newBoard, winner, nextTurn,DOnums} = putMoveOnBoard(gameName,move)

        // console.log(newBoard)
        // console.log(winner)
        // console.log(nextTurn)
        // console.log(DOnums)

        // console.log("Sending to everyone in this room")

        // let many = getAllGames()

        // let ga
        // for(ga in many){
        //     console.log("test")
        //     console.log(many[ga].gameBoard)
        // }

        io.to(gameName).emit('REC_Move_Result',newBoard,winner,nextTurn,DOnums);




    })

    socket.on('disconnect', () => {
        // console.log("lost Connection with: ",socket.id)
        console.log("removing player\n\n\n");
        // removeUser(socket.id)
        // delete players[socket.id];

        // console.log("Current remaining players",players)
        
    })

    socket.on('disconnecting',()=>{
        console.log("the rooms? =========")
        // console.log(socket.rooms)

    })
})

httpserver.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});




function roomCardContent(arrGameNames,logedInName){
    // console.log("Creating Room Card COntent")
    // console.log(arrGameNames)
    // console.log("log in name",logedInName)
    /* turns just a name into
        {
            name:
            mode:
            CurrTurn:
            PLayerNum:
        }
    
    */

    let resArr=[]
    let gName
    let fc
    let obj
    let numU = 0

    if(arrGameNames.length>0){
        for(gName of arrGameNames ){
            numU=0
            fc=getFullGameContent(gName).fullGame
            // console.log(fc)
            // console.log(fc["players"])
            fc["players"].find((ele,index)=>{
                if(ele==logedInName){
                    numU=index+1
                    return ele==logedInName
                }
            })
            obj = {
                name: gName,
                mode: fc.GameMode,
                currTurn: fc.currTurn,
                pNum: numU
            }
            // console.log("Room",obj)
            resArr.push({obj})
            
    
        }
    
        return resArr

    }

    return arrGameNames




}

function handleGameOverCleanUp(gameName,pname){

    userRemoveRoom(pname,gameName)
    removePlayerFromGame(pname,gameName)

}



















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

        
