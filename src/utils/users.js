const users=[]

const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!username || !room){
        return {error:"username and room is required"}
    }
    const existinguser=users.find((user)=>{
        return user.room===room && user.username===username
    })
    if(existinguser){
        return {
            error:"username already exists"
        }
    }
    const user={id,username,room}
    users.push(user)
    return {user}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!=-1){
        return users.splice(index,1)[0]
    }
}
const getUser=(id)=>{
    const user=users.find((user)=>user.id===id)
    if(user){
        return user
    }
}
const getusersinroom=(room)=>{
    room=room.trim().toLowerCase()
    const usersinroom=users.filter((user)=>user.room===room)
    if(usersinroom){
        return usersinroom
    }
}
module.exports={
    addUser,removeUser,getUser,getusersinroom
}