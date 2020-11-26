//後端socket


const formatMessage=require("./message");
const { userJoin,getCurrentUser }=require("../util/user");
const botName="userName";

function socketCon(io){
    io.on("connection",function(socket){

        console.log("user connection");

        socket.on("joinRoom",function({username,room}){
            let user = userJoin(socket.id,username,room);
            console.log(socket.id,username,room);
            socket.join(user.room);
            //當有人連線的是後發出一個message事件 內容是welcome to game
            socket.emit("message",formatMessage(botName,"Welcome to Game") );
            socket.broadcast.to(user.room).emit("message",formatMessage(botName,`${user.username}have user join us`));
            console.log(user.room);
        });
        
        
        //後端接收到chatMessage事件 並且console.log出來
        socket.on("chatMessage",function(msg){
            console.log(msg);
            
            //並且發出一個叫做message的事件給前端 
            io.emit("message",formatMessage("User",msg));
        });
        
        socket.on("disconnect",function(){
            console.log("user discommection"); 
            socket.broadcast.emit("message",formatMessage(botName,"have user left us"));
        });


    });
}





// function socketCon(io){
//     io.on("connection",function(socket){
//         console.log("user connect"); 
        
//         //接收到userName 並且用somemessage廣播回前端
//         socket.on("userName",function(username){
//             socket.broadcast.emit("somemessage", `${username} join us`);
//         });

        
//         //試看看有沒有接收到前端傳來的message
//         socket.on("Message",function(msg){
//             console.log(msg);
//         });
        

//         socket.on("disconnect",function(){
//             console.log("disconnect");
//             socket.broadcast.emit("somemessage", "left!");
//         });

//     });
// }

module.exports= {
    socketCon
};