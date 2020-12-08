const { 
    deleteStandbyRoom,
    addSocketId,
    addNowRoom,
    leaveRoom,
    sessionNumber,
    insertSessionToHistory,
    confirmStart,
    checkReady
} = require("../server/models/socket");


const { 
    verificationToken,
    userReady,
    userUnReady
} = require("../server/models/userModels");


const {
    random
} = require("../util/random");


const { 
    JWT_SECRET
} = process.env;


const moment = require("moment");



const socketCon=function(io){
    //缺乏判斷驗證方式
    io.use(function (socket ,next){
        let token=socket.handshake.query.Authorization;
        verificationToken(token,JWT_SECRET)
            .then(function(user){
                let { id , room ,name ,player} = user;
                //放SQL
                addNowRoom(id,room);
                addSocketId(id,socket.id);

                //放handshake
                socket.handshake.query.user_id=id;
                socket.handshake.query.room=room;
                socket.handshake.query.socketId=socket.id;
                socket.handshake.query.name=name;
                socket.handshake.query.player=player;
                
                socket.join(room);
                
                
                next();
            });
    });
    let Online=0;
    io.on("connection",function(socket){
        Online++;
        
        let { user_id ,room , socketId ,name }=socket.handshake.query;
        
        //限制房間人數
        if (io.sockets.adapter.rooms.get(room).size >2){
            io.sockets.in(socketId).emit("toMany","人數已滿 請換間房間");
        } 
        
        //跟他們說場次編號跟可以開始了
        socket.on("readyStart",function(message){
            let token = message.Authorization;
            let number = message.number;
            verificationToken(token,JWT_SECRET)
                .then(function(result){
                    let { id, room } =result;
                    let mode = "Multiplayer";
                    let moments = moment().format("YYYY-MM-DD-HH:mm:ss");
                    insertSessionToHistory(id,number,mode,moments,room);
                });
        });


        //待機室只要房間人數是2個人就給他們個數字 不管有沒有用沒差=>(有沒有進行遊戲)
        sessionNumber(room)
            .then(function(result){
                if (result[0]["count(*)"] == 2){
                    let randomNumber=random(1,2147483647);
                    console.log(randomNumber);
                    io.sockets.in(room).emit("sessionNumber",randomNumber);
                }
            });
    
        socket.on("ready",function(){
            userReady(user_id);
        });
        socket.on("unReady",function(){
            userUnReady(user_id);
        });

        //這邊每5-10秒打一次  Standby Room
        let timeOut = 0;
        const ready=setInterval(function(){
            timeOut+=1;
            if (timeOut == 11){

                clearInterval(ready);
                io.sockets.in(socketId).emit("timeOut","連線逾時 請重新進入");
                // io.sockets.in(room).emit("timeOut","連線逾時 請重新進入");
            }
            else{
                checkReady(room)
                    .then(function(result){
                        if (result.length == 2){ 
                            io.sockets.in(room).emit("playerReady","ready");   
                            clearInterval(ready);
                        }
                    });
            }
        },5000);





        socket.on("otherSessionCorrect",function(message){
            socket.broadcast.to(room).emit("event", message);
        });



        socket.on("disconnect",function(){
            Online--;
            console.log(Online);
            console.log(`user: ${name} is left room:${room} `);
            deleteStandbyRoom(user_id);
            leaveRoom(user_id);
            clearInterval(ready);
        });
    });

};

module.exports= {
    socketCon
};