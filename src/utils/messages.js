const getmessages=function(username,text){
return {
    username,
    text,
    createdAt:new Date().getTime()
}
}

const getlocationmessage=function(username,url){
return {
    username,
    url,
    createdAt:new Date().getTime()
}
}

module.exports={
    getmessages,
    getlocationmessage
}