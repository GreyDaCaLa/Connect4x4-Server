const users = []

function addUser({id, name, room}){
   let fixedname =name.trim().toLowerCase();
   let fixedroom =room.trim().toLowerCase();
   // const numberOfUsersInRoom = users.filter(user => user.room === room).length
   // if(numberOfUsersInRoom === 2)
   // return { error: 'Room full' }

   const existingUser = users.find((user)=> user.room===fixedroom && user.name===fixedname);

   if(existingUser){
      return {error: "Username in this room is taken"}
   }


   const newUser = { id, name:fixedname, room:fixedroom }
   users.push(newUser)
   return { newUser }
}

function removeUser(id){
   const removeIndex = users.findIndex(user => user.id === id)

   if(removeIndex!==-1)
       return users.splice(removeIndex, 1)[0] //splice returns the removed so [0]acesses it
}

function getUser(id){
   return users.find(user => user.id === id)
}

function getUsersInRoom(room){
   return users.filter(user => user.room === room)
}

export {addUser, removeUser, getUser, getUsersInRoom};