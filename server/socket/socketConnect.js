const { 
    deleteStandbyRoom,
    addSocketId,
    insertSessionToHistory,
    checkScoreModeAndReady,
    checkBuzzModeAndReady,
    updataCurrectNumber,
    checkScore,
    NowStandbyRoomAndMode,
    standbyRoomUser,
    confirmStandbyRoomNumber
}=require("../models/socketModel");

const { 
    verificationToken,
    updateUserReady,
    updateUserUnready,
    addUserToStandbyRoom,
    updateBuzzWin,
    updateScoreWin,
} = require("../models/userModels");


const {
    random
} = require("../../util/random");

const {
    deleteBuzzGame, 
    insertToBuzzGameTopic,
    getTwoHundredWord,
    insertBuzzGame,
    getThisSessionBuzzTopic,
    updateTopicNnumber,
    insertTopic,
    insertCorrect,
    insertError,
    checkAnswer,
    raceCondition,
    confirmBuzzGameRoomStatus,
    updateCorrectTopicNumber
} = require("../models/gameModel");

const { 
    JWT_SECRET
} = process.env;


const moment = require("moment");
const crypto=require("crypto");
const { now } = require("moment");




const socketCon=function(io){
    io.use(async function (socket ,next){
        let token=socket.handshake.query.Authorization;
        if (token == "null"){
            return {message:"please signin first"};
        }
        else{
            try{
                let user=await verificationToken(token,JWT_SECRET);
                let { id , room ,name } = user;
                await addSocketId(id,socket.id);
                //put on handshake
                socket.handshake.query.user_id=id;
                socket.handshake.query.room=room;
                socket.handshake.query.socketId=socket.id;
                socket.handshake.query.name=name;
                socket.join(room);
                
                next();
            }
            catch(error){
                console.log(error);
                return {message:"please signin first"};
            }
        }
    });
    io.on("connection",async function(socket){
        
        let { user_id ,room , socketId ,name }=socket.handshake.query;
        
        socket.on("checkStandbyRoom",async function(room){
            let res = await confirmStandbyRoomNumber(room);
            if (res[0]["count(*)"] >= 3 ){
                io.sockets.in(socketId).emit("toMany","The room is full, please change rooms");
            }
        });


        //chat bar (standbyRoom)
        socket.on("ready",async function(){

            let time=moment().format("HH:mm:ss");
            let data={name,time};
            io.sockets.in(room).emit("userReadyMessage",data);
            
            await updateUserReady(user_id);

            let score = await checkScoreModeAndReady(room);
            let buzz = await checkBuzzModeAndReady(room);

            //If two people prepare in score mode
            if (score.length == 2 ){
                let Number=random(1,2147483647);
                let sessionNumber=crypto.createHash("sha1").update(Number+toString(now())).digest("hex");
                let moments = moment().format("YYYY-MM-DD-HH:mm:ss");
                for (let i=0;score.length>i;i++){
                    let { uid ,room,mode}=score[i];
                    await insertSessionToHistory(uid,sessionNumber,mode,moments,room);
                }
                io.sockets.in(room).emit("scorePlayerReady","ready");
            }

            //If two people prepare in buzz mode
            else if (buzz.length ==2){
                let Number=random(1,2147483647);
                let sessionNumber=crypto.createHash("sha1").update(Number+toString(now())).digest("hex");
                let moments = moment().format("YYYY-MM-DD-HH:mm:ss");
                for (let i=0;buzz.length>i;i++){
                    let { uid ,room,mode}=buzz[i];
                    await insertSessionToHistory(uid,sessionNumber,mode,moments,room);
                    await insertBuzzGame(uid,room);
                }
                let word=await getTwoHundredWord();
                let final={};
                for (let i=0 ;50>=i;i++){
                    let english=[];
                    let chinese=[];
                    for (let i=1;4>=i;i++){
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


        //Cancel preparation
        socket.on("unReady",function(){
            let time=moment().format("HH:mm:ss");
            let data={name,time};
            io.sockets.in(room).emit("userUnreadyMessage",data);
            updateUserUnready(user_id);
        });

        socket.on("tellEveryoneAboutTheRoom",async function(){
            let room=await NowStandbyRoomAndMode();
            let nowRoom={};
            for(let i=0;room.length>i;i++){
                if (room[i]["count(1)"]<2){
                    nowRoom[room[i]["room"]]=room[i]["mode"];
                }
            }
            io.sockets.emit("howManyStandbyRoomsNow",nowRoom);
        });

        socket.on("roomUser",async function(room){
            let list=await standbyRoomUser(room);
            io.sockets.in(room).emit("userList",list);
        });






        //buzz mode
        socket.on("confirmAnswer",async function(message){
            let { sessionNumber,english,id,name,option,room,countTopicNumber,i }=message;
            await insertTopic(id,sessionNumber,english);
            let check =await checkAnswer(english);
            let answer = check[0].chinese;
            //correct
            if (answer == option){
                await insertCorrect(id,sessionNumber,english);
                let result=await raceCondition(sessionNumber,countTopicNumber);

                let {message}=result;
                if (message == "success"){
                    countTopicNumber++;
                    await updateCorrectTopicNumber(countTopicNumber,room);
                    let data={sessionNumber,english,id,name,option,room,i};
                    io.sockets.in(socketId).emit("correct",data);
                }
            }

            //error
            else {
                await insertError(id,sessionNumber,english);
                socket.broadcast.to(room).emit("event2",i);
                io.sockets.in(socketId).emit("selfError",i);
                let result = await confirmBuzzGameRoomStatus(room,countTopicNumber,id);

                if (result.message == "Change question"){
                    countTopicNumber++;
                    result=await getThisSessionBuzzTopic(sessionNumber,countTopicNumber);
                    let topicEnglish = result[0].topic_english;
                    let Chinese=result[0].topic_chinese;
                    let topicChinese=JSON.parse(Chinese);
                    let data={topicEnglish,topicChinese};
                    socket.broadcast.to(room).emit("event3",data);

                    let information={id,sessionNumber,name,room,topicChinese,topicEnglish};
                    io.sockets.in(socketId).emit("error",information);
                }

            }
        });


        socket.on("click",function(i){
            socket.broadcast.to(room).emit("stopClick",i);
        });


        socket.on("newTopic",async function(message){
            let { id,name,room,countTopicNumber}=message;
            let session=message.sessionNumber;
            let result=await getThisSessionBuzzTopic(session,countTopicNumber);
            let topicEnglish=result[0].topic_english;
            let topicNumber=result[0].topic_number;
            let string = result[0].topic_chinese;
            let topicChinese =JSON.parse(string);
            let data={topicEnglish,topicChinese,topicNumber,id,name,room,session};
            io.sockets.in(socketId).emit("createNewTopic",data);
        });




        socket.on("otherOneChangeTopic",function(message){
            socket.broadcast.to(room).emit("event",message);
        });

        //correct
        socket.on("otherSessionCorrect",async function(message){
            let { countTopicNumber,localStorageSession,click }=message;
            let session=localStorageSession.replace("\"","").replace("\"","");
            let result=await getThisSessionBuzzTopic(session,countTopicNumber);
            let topicEnglish=result[0].topic_english;
            let Chinese=result[0].topic_chinese;
            let topicChinese=JSON.parse(Chinese);
            let data={element:click,topicEnglish,topicChinese};
            socket.broadcast.to(room).emit("event",data);
        });


        socket.on("updataTopicNumber",async function(message){
            let {uid,countTopicNumber} = message;
            await updateTopicNnumber(uid,countTopicNumber);
        });

        socket.on("updataCurrectNumberToSQL",async function(res){
            let { id }=res;
            await updataCurrectNumber(id);
            let result=await checkScore(id);
            let score=result[0]["currect"];
            
            
            //Here is the message of winning, 10 points win
            if (score ==10){ 
                await updateBuzzWin(id);
                io.sockets.in(socketId).emit("WinMessage","Win");
                socket.broadcast.to(room).emit("LostMessage","Lost");
            }
        });


        socket.on("addStandbyRoomToSQL",async function(token){
            let res=await verificationToken(token,JWT_SECRET);
            let { id,room,mode }=res;
            await addUserToStandbyRoom(id,room,mode,token);
        });


        socket.on("opponentLeaveGame",function(){
            socket.broadcast.to(room).emit("catchOpponentLeaveGame","leave");
        });

        socket.on("buzzOpponentLeaveGameSoYouWin",async function(){
            await updateBuzzWin(user_id);
        });

        socket.on("scoreOpponentLeaveGameSoYouWin",async function(){
            await updateScoreWin(user_id);
        });


        socket.on("disconnect",async function(){
            let time=moment().format("HH:mm:ss");
            let data = {name,time};
            io.sockets.in(room).emit("leaveRoomMessage",data);
            deleteBuzzGame(user_id);
            console.log(`user: ${name} is left room:${room} `);
            deleteStandbyRoom(user_id);


            let list=await standbyRoomUser(room);
            io.sockets.in(room).emit("userList",list);

            let totalRoom=await NowStandbyRoomAndMode();
            let nowRoom={};
            for(let i=0;totalRoom.length>i;i++){
                if (totalRoom[i]["count(1)"]<2){
                    nowRoom[totalRoom[i]["room"]]=totalRoom[i]["mode"];
                }
            }
            io.sockets.emit("howManyStandbyRoomsNow",nowRoom);
        });
    });

};


module.exports= {
    socketCon
};