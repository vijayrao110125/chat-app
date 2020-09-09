const socket=io()
$sendlocationbutton=document.querySelector("#send-location")
const $messageform=document.querySelector("#message-form")
const $messageforminput=$messageform.querySelector('input')
const $messageformbutton=$messageform.querySelector('button')
const $messages=document.querySelector("#messages")
const messagetemplate=document.querySelector("#message-template").innerHTML
const locationmessage=document.querySelector("#location-message-template").innerHTML
const sidebartemplate=document.querySelector("#sidebar-template").innerHTML
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})



const autoscroll=()=>{
    const $newmessage=$messages.lastElementChild
    const newmessagestyle=getComputedStyle($newmessage)
    const newmessagemargin=parseInt(newmessagestyle.marginBottom)
    const newmessageheight=$newmessage.offsetHeight + newmessagemargin
    const visibleheight=$messages.offsetHeight
    const containerheight=$messages.scrollHeight
    const scrolloffset=$messages.scrollTop+visibleheight
    if(containerheight-newmessageheight<=scrolloffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}


socket.on("message",(message)=>{
console.log(message)
const html=Mustache.render(messagetemplate,{
    username:message.username,
message:message.text,
createdAt:moment(message.createdAt).format('h:mm a')
})
$messages.insertAdjacentHTML("beforeend",html)
autoscroll()
})



socket.on('locationmessage',(message)=>{
    console.log(message)
const html=Mustache.render(locationmessage,{
    username:message.username,
    url:message.url,
    createdAt:moment(message.createdAt).format("h:mm a")
})
$messages.insertAdjacentHTML("beforeend",html)
autoscroll()
})

socket.on("roomData",({room,users})=>{
    const html=Mustache.render(sidebartemplate,{
        room,users
    })
    document.querySelector("#sidebar").innerHTML=html
})

$messageform.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageformbutton.setAttribute('diabled','disabled')
    const message=e.target.message.value
    socket.emit("sendmessage",message,(error)=>{
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value=''
        $messageforminput.focus()
        if(error){
            return console.log(error)
        }
        console.log("message delivered!")
    })
})

$sendlocationbutton.addEventListener("click",()=>{
        if(!navigator.geolocation){
            return alert("your browser doesn't support location!")
        }
        $sendlocationbutton.setAttribute('disabled','disabled')
        navigator.geolocation.getCurrentPosition((position)=>{
            socket.emit("sendlocation",{
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            },()=>{
                $sendlocationbutton.removeAttribute('disabled')
                console.log("location sent!")
            })
        })
})


socket.emit("join",{username,room},(error)=>{
    if(error){
        alert(error)
        location.href="/"
    }
})