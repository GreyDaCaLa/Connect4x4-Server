const users = {}
/*
{  
   name: "", all lowercase trim outerspace .trim().toLowerCase()
   password: "", all lowercase trim outerspace .trim().toLowerCase()
   active: false or true, they are currently connected
   rooms: [{},{}], array of rooms objects the user is a part of
      {}= {
         name:
         mode:
         piecetype:
         currTurn:
      }
}
*/

function createUser(name, pass){
   let fixedname = name.trim().toLowerCase();
   let fixedpass = pass.trim().toLowerCase();

   // const existingUser = users.find((user)=> user.name===fixedname);
   const existingUser = users[fixedname];

   // console.log("Existing user?:",existingUser);
   if(existingUser){
      return {error: "Username is Already taken"}
   }

   const newUser = { 
      name:fixedname, 
      password:fixedpass,
      rooms: [] 
   }

   users[fixedname]=newUser;

   // console.log("here are all the current users saved")
   // console.log(users);

   return { newUser }
}

function loginUser(name,pass){
   let fixedname = name.trim().toLowerCase();
   let fixedpass = pass.trim().toLowerCase();
 
   const existingUser = users[fixedname]

   // console.log("Existing user?:",existingUser);

   if(!existingUser){
      return {error: "This Username does not exist"}
   }

   if(existingUser.password !== fixedpass){
      return {error: "This Username exists but the password doesn't match"}
   }

   users[fixedname].active=true;

   let user = users[fixedname]

   return {user}
}

function userAddRoom(name,room){
   // console.log("----userAddRoom")
   users[name].rooms.push(room.trim().toLowerCase());
   return users[name]
}

function userRemoveRoom(name,room){
   let foundindex = null
   users[name].rooms.find((ele,index)=>{
      if(ele==room){
         foundindex=index
      }
      return ele==room
   })

   if(foundindex != null){
      users[name].rooms.splice(foundindex,1)
   }
}

function getUser(name){
   return users[name]
}




export {createUser, loginUser, userAddRoom, getUser, userRemoveRoom};