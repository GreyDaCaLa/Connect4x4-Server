import { checkWinner } from "./WinCond.js";

const games = {};
/*
name {  
   name: "", //name of the room for the game
   full: false //is the room full of players
   players: ["","","",""] //players in the game
   CountDO: [2,2,2,2],
   GameMode: "", //reg or 4x4
   gameBoard: ?? //the game board
   pastGB: ?? // past game board
   currTurn: 1 or 2 or 3 or 4 
}
*/



function createGame(givenName,mode, pname) {
  let fixedname = givenName.trim().toLowerCase();
  let initBoard = [
    ["--", "--", "--", "--", "--", "--"],
    ["--", "--", "--", "--", "--", "--"],
    ["--", "--", "--", "--", "--", "--"],
    ["--", "--", "--", "--", "--", "--"],
    ["--", "--", "--", "--", "--", "--"],
    ["--", "--", "--", "--", "--", "--"],
    ["--", "--", "--", "--", "--", "--"],
  ];

  // const existingUser = users.find((user)=> user.name===fixedname);
  const existingGame = games[fixedname];

  // console.log("Existing user?:",existingUser);
  if (existingGame) {
    return { error: "This Name Is Already Taken" };
  }

  let listofplayers = [pname, ""]
  if(mode=="4x4"){
    listofplayers = [pname, "", "", ""]

  }

  // console.log("THE BIGINNING BOARD")
  // console.log(initBoard)
  

  const newGame = {
    name: fixedname,
    full: false,
    players: listofplayers,
    CountDO: [2,2,2,2],
    GameMode: mode, //reg or 4x4
    gameBoard: [...initBoard],
    pastGB: {},
    currTurn: 1,
  };

  games[fixedname] = newGame;

  // console.log("here are all the current games saved");
  // console.log(games);

  return { newGame };
}

function del_Game(gName){
  console.log("---Deleting game?")

  let gone = false

  if(games[gName]){
    let plyrs = games[gName].players

    if(plyrs.length==2){

      if(plyrs[0]=='-PLG-' && plyrs[1]=='-PLG-'){
        delete games[gName]
        gone = true
      }

    }

    if(plyrs.length==4){

      if(plyrs[0]=='-PLG-' && plyrs[1]=='-PLG-' && plyrs[2]=='-PLG-' && plyrs[3]=='-PLG-'){
        delete games[gName]
        gone = true
      }
      
    }


    
  }

  if(gone){
    console.log(`game ${gName} has been deleted`)
  }else{
    console.log(`game ${gName} still lives`)
  }


}

function getFullGameContent(gameRoomName) {

  const existingGame = games[gameRoomName.trim().toLowerCase()];

  if (!existingGame) {
    return { error: "Fatal error this game does not exist" };
  }

  let fullGame = existingGame;

  return { fullGame };
}

function getPlayersInGame(gameName) {
  const existingGame = games[gameName];

  if (!existingGame) {
    return { error: "Fatal error this game does not exist" };
  }

  let playersInGame = existingGame.players;

  return { playersInGame };
}

function addPlayerToGame(playerName, gameName, i) {


  if(i>=games[gameName].players.length-1){games[gameName].full=true}
  games[gameName].players[i] = playerName;
  return games[gameName].players;
}

function removePlayerFromGame(pName,gName){
  if(games[gName]){
    let foundindex = null
    if(games[gName].players[0]==pName){games[gName].players[0]="-PLG-"}
    if(games[gName].players[1]==pName){games[gName].players[1]="-PLG-"}
    if(games[gName].players[2]==pName){games[gName].players[2]="-PLG-"}
    if(games[gName].players[3]==pName){games[gName].players[3]="-PLG-"}
  }

  del_Game(gName)
}

function putMoveOnBoard(gameName, move) {
  let { col, chip } = move;

  let newBoard;
  let winner;
  let nextTurn = games[gameName].currTurn;
  let DOnums= games[gameName].CountDO

  let gb = [...games[gameName].gameBoard];
  let land = "";

  //Keeping track of full chips used
  if(chip[0]==chip[1] && chip[0]!='-'){
    DOnums[chip[0]-1] = DOnums[chip[0]-1] -1
  }

  //handeling move on board
  for (let i = 0; i < gb[col].length && !land; i++) {
    // console.log(`col: ${col} |i:${i} =`, gb[col][i], chip);

    if (gb[col][i][0] !== "-") {
      if (chip[0] !== "-") {
        if (chip[1] !== "-") {
          gb[col][i - 1] = chip;
          // console.log("land:", chip);
        } else {
          land = chip[0] + gb[col][i - 1][1];
          gb[col][i - 1] = land;
          // console.log("land:", land);
        }

        //return gb;
        let rescheckwinner = checkWinner(gb);
        if (rescheckwinner) {
          // setWinner(rescheckwinner)
          winner = rescheckwinner;
        }
        // setGameBoard(gb);
        newBoard = gb;
        break;
      }
    }

    if (gb[col][i][1] !== "-") {
      if (chip[1] !== "-") {
        if (chip[0] !== "-") {
          gb[col][i - 1] = chip;
          // console.log("land:", chip);
        } else {
          land = gb[col][i - 1][0] + chip[1];
          // console.log("land:", land);
          gb[col][i - 1] = land;
        }

        //return gb;
        let rescheckwinner = checkWinner(gb);
        if (rescheckwinner) {
          // setWinner(rescheckwinner)
          winner = rescheckwinner;
        }
        // setGameBoard(gb);
        newBoard = gb;
        break;
      }
    }

    if (i === gb[col].length - 1) {
      //if we are at the bottom
      // console.log("in bottom row");
      if (gb[col][i][0] === "-" && gb[col][i][1] === "-") {
        // if both inner and outer are empty
        land = chip;
        // console.log("both bottom");
      } else if (chip[0] !== "-") {
        land = chip[0] + gb[col][i][1];
        // console.log("back bottom");
      } else if (gb[col][i][1] === "-") {
        land = gb[col][i][0] + chip[1];
        // console.log("Front bottom");
      }
      // console.log("land:", land);
      gb[col][i] = land;

      //return gb;
      let rescheckwinner = checkWinner(gb);
      if (rescheckwinner) {
        // setWinner(rescheckwinner)
        winner = rescheckwinner;
      }
      // setGameBoard(gb);
      newBoard = gb;
      break;
    }
  }




  // printLog_GameBoard(gb);

  // calculating next turn
  if(games[gameName].GameMode == "4x4"){
    if (nextTurn == 4) {
      // setCurrTurn(1);
      nextTurn = 1;
    } else {
      // setCurrTurn(currTurn+1);
      nextTurn = nextTurn + 1;
    }

  }

  if(games[gameName].GameMode == "reg"){
    if(nextTurn == 2){
      nextTurn =1

    }else{
      nextTurn = nextTurn + 1;
    }
  }


  //seting if winner
  if(!winner){winner=false}

  games[gameName].gameBoard = newBoard;
  games[gameName].winner = winner;
  games[gameName].currTurn = nextTurn;
  games[gameName].CountDO = DOnums;

  return {newBoard,winner,nextTurn,DOnums}
}

function getAllGames (){
  return games
}

export {
  createGame,
  getFullGameContent,
  getPlayersInGame,
  addPlayerToGame,
  putMoveOnBoard,
  getAllGames,
  removePlayerFromGame,
};
