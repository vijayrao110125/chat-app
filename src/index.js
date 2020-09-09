const express=require("express")
const path=require("path")
const socketio=require("socket.io")
const http=require("http")
const Filter=require("bad-words")
const {getmessages,getlocationmessage}=require("./utils/messages")
const {addUser,removeUser,getUser,getusersinroom}=require("./utils/users")


const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port=process.env.PORT||3000
const publicpath=path.join(__dirname,"../public")
var count=0
app.use(express.static(publicpath))
io.on("connection",(socket)=>{
    console.log("connected")
    socket.on('join',(options,callback)=>{
        const {error,user}=addUser({id:socket.id,...options})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit("message",getmessages("Admin","Welcome!"))
    socket.broadcast.to(user.room).emit('message',getmessages("Admin", user.username+" has joined!"))
    io.to(user.room).emit("roomData",{
        room:user.room,
        users:getusersinroom(user.room)
    })
    callback()
    })
    socket.on("sendmessage",(message,callback)=>{
        const user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback("profanity is not allowed!")
        }
        io.to(user.room).emit('message',getmessages(user.username,message))
        callback()
    })
    socket.on('sendlocation',(coords,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationmessage',getlocationmessage(user.username,'https://google.com/maps?='+coords.latitude+','+coords.longitude))
        callback()
    })
    socket.on("disconnect",()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',getmessages("Admin",user.username+" has left!"))
            io.to(user.room).emit("roomData",{
                room:user.room,
                users:getusersinroom(user.room)
            })
        }
    })
})

server.listen(port,()=>{
    console.log("Server Started....")
})