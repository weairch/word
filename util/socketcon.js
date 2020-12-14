const { 
    deleteStandbyRoom,
    addSocketId,

    sessionNumber,
    insertSessionToHistory,

    checkScoreModeAndReady,
    checkBuzzModeAndReady,
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
    deleteBuzzGame, 
    selectFourRandomWord,
    insertToBuzzGameTopic,
    deleteBuzzGameTopic,
    randomThirtyWord,
    insertBuzzGame,
} = require("../server/models/gameModel");

const { 
    JWT_SECRET
} = process.env;


const moment = require("moment");
const crypto=require("crypto");
const { now } = require("moment");





const socketCon=function(io){
    //缺乏判斷驗證方式
    io.use(function (socket ,next){
        let token=socket.handshake.query.Authorization;
        verificationToken(token,JWT_SECRET)
            .then(function(user){
                let { id , room ,name ,player} = user;
                //放SQL
                // addNowRoom(id,room);
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
    // let Online=0;
    io.on("connection",async function(socket){
        // Online++;
        
        
        let { user_id ,room , socketId ,name }=socket.handshake.query;
        
        //限制房間人數
        if (io.sockets.adapter.rooms.get(room).size >2){
            io.sockets.in(socketId).emit("toMany","人數已滿 請換間房間");
        } 
        

        socket.on("ready",async function(){
            console.log("點擊次數呢");
            await userReady(user_id);

            let score = await checkScoreModeAndReady(room);
            let buzz = await checkBuzzModeAndReady(room);
            if (score.length == 2 ){
                let Number=random(1,2147483647);
                let sessionNumber=crypto.createHash("sha1").update(Number+toString(now())).digest("hex");
                let moments = moment().format("YYYY-MM-DD-HH:mm:ss");
                for (let i=0;score.length>i;i++){
                    let { uid ,Room,mode}=score[i];
                    await insertSessionToHistory(uid,sessionNumber,mode,moments,Room);
                }
                io.sockets.in(room).emit("scorePlayerReady","ready");
            }
            else if (buzz.length ==2){
                
                let Number=random(1,2147483647);
                let sessionNumber=crypto.createHash("sha1").update(Number+toString(now())).digest("hex");
                let moments = moment().format("YYYY-MM-DD-HH:mm:ss");
                for (let i=0;buzz.length>i;i++){
                    let { uid ,Room,mode}=buzz[i];
                    await insertSessionToHistory(uid,sessionNumber,mode,moments,Room);
                    await insertBuzzGame(uid,room)
                }
                let word=await randomThirtyWord();
                let final={};
                for (let i=0 ;30>=i;i++){
                    let english=[];
                    let chinese=[];
                    for (let i=1;4>=i;i++){
                        //
                        let randomNumber= random(0,30);
                        chinese.push(word[randomNumber].chinese);
                        english.push(word[randomNumber].english);
                    }
                    let randomToFour=random(0,4);
                    let English=english[randomToFour];
                    let data={English,chinese};
                    final[i]=data;
                    await insertToBuzzGameTopic(sessionNumber,English,i,JSON.stringify(chinese));
                }

                io.sockets.in(room).emit("buzzPlayerReady",sessionNumber);
            }

        });
        socket.on("unReady",function(){
            userUnReady(user_id);
        });

        //這邊每5-10秒打一次  Standby Room
        let timeOut = 0;
        const ready=setInterval(async function(){
            timeOut+=1;
            if (timeOut == 11){
                clearInterval(ready);
                io.sockets.in(socketId).emit("timeOut","連線逾時 請重新進入");
            }
        },5000);

        //答對
        socket.on("otherSessionCorrect",function(message){
            console.log(message);
            socket.broadcast.to(room).emit("event", message);
        });

        //一個人答錯 給另外一個人反應畫面
        socket.on("otherSessionWrong",function(message){
            socket.broadcast.to(room).emit("event2", message);
        });

        //兩個人都錯了 該換題了
        socket.on("BothError",function(message){
            console.log("傳到了後端的socket on");
            socket.broadcast.to(room).emit("event3",message);
        });

        socket.on("test",function(){
            console.log("收到了");
            io.sockets.in(socketId).emit("killer","kill");
        });

        

        socket.on("disconnect",function(){
            // Online--;
            // console.log(Online);

            //這裡是刪除物件
            // delete topic[room];

            //這裡是刪除sql
            // deleteBuzzGameTopic(room);



            deleteBuzzGame(user_id);
            console.log(`user: ${name} is left room:${room} `);
            deleteStandbyRoom(user_id);
            // leaveRoom(user_id);
            clearInterval(ready);
        });
    });

};

module.exports= {
    socketCon
};