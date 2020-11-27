const { formatMessage } =require("./userMesasge");

function socketCon(io){
    io.on("connection",function(socket){
        socket.on("joinRoom",function({username,room}){
            console.log(username+" connection to room "+room);
            socket.join(room);

            socket.on("user1FightMessage",function(msg){
                io.sockets.in(room).emit("user1Message",formatMessage(msg));
                console.log("user1 Message is "+msg);
            });

            socket.on("user2FightMessage",function(msg){
                io.sockets.in(room).emit("user2Message",formatMessage(msg));
                console.log("user2 Message is "+msg);
            });



            socket.on("disconnect",function(){
                console.log(username+" disconnect to "+room);
            });

        });


        socket.on("userTopic",function(Topic){
            let userTopic=Topic.english;
            let userTopicType=Topic.type;
            let answer=Topic.chinese;

            socket.on("battleMessage",function(user){
                let userinput = formatMessage(user.msg,user.username);
                console.log(userinput);
            });
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