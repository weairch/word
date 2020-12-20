const { 
    deleteStandbyRoom,
    addSocketId,
    // sessionNumber,
    insertSessionToHistory,
    checkScoreModeAndReady,
    checkBuzzModeAndReady,
    updataCurrectNumber,
    checkScore,
    // checkGameTopicStatus,
    // updateGameTopicStatus,
    NowStandbyRoomAndMode,
} = require("../server/models/socketModel");


const { 
    verificationToken,
    userReady,
    userUnReady,
    userInStandbyRoom,
} = require("../server/models/userModels");


const {
    random
} = require("../util/random");

const {
    deleteBuzzGame, 
    // selectFourRandomWord,
    insertToBuzzGameTopic,
    // deleteBuzzGameTopic,
    randomThirtyWord,
    insertBuzzGame,
    buzzTopic,
    // raceCondition,
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
        console.log("connection");
        let { user_id ,room , socketId ,name }=socket.handshake.query;

        
        //限制房間人數
        if (io.sockets.adapter.rooms.get(room).size >2){
            io.sockets.in(socketId).emit("toMany","人數已滿 請換間房間");
        } 
        

        socket.on("ready",async function(){
            console.log("點擊準備");

            let time=moment().format("HH:mm:ss");
            let data={name,time};
            io.sockets.in(room).emit("userReadyMessage",data);
            
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
                    await insertBuzzGame(uid,room);
                }
                let word=await randomThirtyWord();
                let final={};
                for (let i=0 ;50>=i;i++){
                    let english=[];
                    let chinese=[];
                    for (let i=1;4>=i;i++){
                        //
                        let randomNumber= random(0,100);
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
            let time=moment().format("HH:mm:ss");
            let data={name,time};
            io.sockets.in(room).emit("userUnreadyMessage",data);
            userUnReady(user_id);
            console.log("取消準備");
        });


        //答對
        socket.on("otherSessionCorrect",async function(message){
            let { countTopicNumber,localStorageSession,click }=message;
            let result=await buzzTopic(localStorageSession,countTopicNumber);
            let { topicEnglish } = result[0];
            let Chinese=result[0].topicChinese;
            let topicChinese=JSON.parse(Chinese);
            let data={element:click,topicEnglish,topicChinese};
            socket.broadcast.to(room).emit("event",data);
        });

        //一個人答錯 給另外一個人反應畫面
        socket.on("otherSessionWrong",function(message){
            socket.broadcast.to(room).emit("event2", message);
        });

        //兩個人都錯了 該換題了
        socket.on("BothError",async function(message){
            // console.log(message);
            let { countTopicNumber,localStorageSession }=message;
            let result=await buzzTopic(localStorageSession,countTopicNumber);
            let { topicEnglish } = result[0];
            let Chinese=result[0].topicChinese;
            let topicChinese=JSON.parse(Chinese);
            let data={topicEnglish,topicChinese};
            socket.broadcast.to(room).emit("event3",data);
        });


        //chat bar
        socket.on("sendMessage",function(res){
            let time=moment().format("HH:mm:ss");
            let {name,room,message}=res;
            let data = {name,room,time,message};
            io.sockets.in(socketId).emit("selfInput",data);
            socket.broadcast.to(room).emit("ortherMessage",data);
        });


        socket.on("joinRoomMessage",function(){
            let time=moment().format("HH:mm:ss");
            let data={name,time};
            io.sockets.in(room).emit("joinRoomWelcomeMessage",data);
        });


        socket.on("updataCurrectNumberToSQL",async function(res){
            let { id }=res;
            await updataCurrectNumber(id);
            let result=await checkScore(id);
            let score=result[0]["currect"];
            if (score ==10){ //這裡傳送出贏的訊息 10分者贏
                io.sockets.in(socketId).emit("WinMessage","Win");
                socket.broadcast.to(room).emit("LostMessage","Lost");
            }
        });


        socket.on("addStandbyRoomToSQL",async function(token){
            let res=await verificationToken(token,JWT_SECRET);
            let { id,room,mode }=res;
            await userInStandbyRoom(id,room,mode,token);
        });


        socket.on("tellEveryoneAboutTheRoom",async function(){
            let room=await NowStandbyRoomAndMode();
            let nowRoom={};
            for(let i=0;room.length>i;i++){
                if (room[i]["count(1)"]<2){
                    nowRoom[room[i]["Room"]]=room[i]["mode"];
                }
            }
            io.sockets.emit("howManyStandbyRoomsNow",nowRoom);
        });



        socket.on("disconnect",async function(){
            let time=moment().format("HH:mm:ss");
            let data = {name,time};
            io.sockets.in(room).emit("leaveRoomMessage",data);
            deleteBuzzGame(user_id);
            console.log(`user: ${name} is left room:${room} `);
            deleteStandbyRoom(user_id);




            let totalRoom=await NowStandbyRoomAndMode();
            let nowRoom={};
            for(let i=0;totalRoom.length>i;i++){
                if (totalRoom[i]["count(1)"]<2){
                    nowRoom[totalRoom[i]["Room"]]=totalRoom[i]["mode"];
                }
            }
            io.sockets.emit("howManyStandbyRoomsNow",nowRoom);
        });
    });

};

module.exports= {
    socketCon
};