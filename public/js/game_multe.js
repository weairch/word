// eslint-disable-next-line no-undef
let socket = io();

socket.on("message",function(message){
    console.log(message); 
});