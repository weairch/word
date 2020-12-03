const { formatMessage } =require("./user");
const { selectRandomWord } = require("../server/models/function_model");
const { insertTopic , deleteStandbyRoom ,addSocketId , addNowRoom ,leaveRoom,sessionNumber ,insertSessionToHistory ,confirmStart  ,checkReady} = require("../server/models/socket");
const { verificationToken , userReady , userUnReady } = require("../server/models/userModels");
const { random } = require("../util/random");
const { JWT_SECRET } = process.env;
const moment = require("moment");
const function_model = require("../server/models/function_model");



//每題間隔5000毫秒
const topicTime = 5000;

//給前端timeOut倒數計時是5秒
const timeOut = 5;

//最多跑到幾個題目
const topicMaxNumber=30;


// let nowRoom = {
    
// };
// let user1 =[];

const socketCon=function(io){
    //缺乏驗證方式
    io.use(function (socket ,next){
        let token=socket.handshake.query.Authorization;
        verificationToken(token,JWT_SECRET)
            .then(function(user){
                let { id , room ,name ,player} = user;
                //放SQL
                addNowRoom(id,room);
                addSocketId(id,socket.id);

                //放{}
                // nowRoom[room:[socket]] = room;
                // console.log(socket.id);
                // user1.push(socket.id);
                // nowRoom[room]=user1;
                // nowRoom[room]=user1.push(user1);

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
    io.on("connection",function(socket){
        let { user_id ,room , socketId ,name}=socket.handshake.query;
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


        //待機室只要房間人數是2個人就給他們個數字 不管有沒有用到都沒差
        sessionNumber(room)
            .then(function(result){
                if (result[0]["count(*)"] == 2){
                    let randomNumber=random(1,999999999);
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

        //這邊每5-10秒打一次 
        let timeOut = 0;
        const ready=setInterval(function(){
            timeOut+=1;
            console.log(timeOut);
            if (timeOut == 11){

                clearInterval(ready);
                io.sockets.in(room).emit("timeOut","連線逾時 請重新進入");
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
        },9000);



        socket.on("disconnect",function(){
            console.log(`user: ${name} is left room:${room} `);
            deleteStandbyRoom(user_id);
            leaveRoom(user_id);
            clearInterval(ready);
        });
    });

};


// function socketCon(io){
//     io.on("connection",function(socket){
//         let token=socket.handshake.query.Authorization;
//         //綁定socketId跟nowRoom到DB user 
//         verificationToken(token,JWT_SECRET)
//             .then(function(result){
//                 addNowRoom(result.id,result.room);
//                 addSocketId(result.id,socket.id);
//                 standbyRoom




//                 socket.on("disconnect",function(){
//                     console.log("some one out")
//                     deleteStandbyRoom(result.id);
//                     leaveRoom(result.id);
//                     console.log("這裡是在房間內離開");
//                 });
//             });

//         //準備房間
//         socket.on("joinRoom",function({id,room}){
//             // console.log("編號",id,"玩家",name,"進入",room);
//             //讓玩家加入房間
//             socket.join(room);

//             //知道房間的玩家人數
//             let roomPeopleCount = io.sockets.adapter.rooms.get(room).size;

//             //讓玩家知道哪一個是player_1 哪一個是 player_2
//             io.sockets.in(room).emit("roomPeopleCount",roomPeopleCount);
//             if (roomPeopleCount == 1){
//                 io.sockets.in(room).emit("roomPeopleCount","player_1");
//             }
//             socket.on("disconnect",function(){
//                 // console.log("編號",id,"名字",name,"離開房間"+room);
//                 //離開準備房間的時候 要刪除standbyRoom的名單
//                 deleteStandbyRoom(id);
//             });
//         });
//         //遊戲房間
//         socket.on("gameRoom",function({id,name,player,room}){
//             let token = socket.handshake;
//             console.log(token);
//             console.log(socket.id);
//             console.log("遊戲房間內編號",id,"玩家",name,"進入",room);
//             socket.join(room);
//             console.log("玩家",name,"在",room,"房間擔任",player,"準備開始遊戲!!");
//             //偵測房間人數
//             let gameRoomCountPlayer = io.sockets.adapter.rooms.get(room).size;
//             //人數2雙方都會收到 可是人數1只有1個人會收到
//             io.sockets.in(room).emit("gameRoomCountPlayer",gameRoomCountPlayer);



//             socket.on("gameStart",function(randomSesson){
//                 if (randomSesson){
//                     console.log(randomSesson);


//                     //這裡可以開始廣播題目到前端
//                     //延遲一秒傳送
//                     setTimeout(function(){
//                         io.sockets.in(room).emit("StartMessage",formatMessage("人數到齊!! 手指放在鍵盤上~~~ 準備開始!!"));
//                     },1000);


   
//                     //==========================
//                     //遊戲開始的題目
//                     //==========================

//                     let topicNumber = 0;
//                     const topicLoop=setInterval(function(){
//                         //=============
//                         //這裡可以改if跟else互相調換
//                         //===========
//                         if (topicNumber == topicMaxNumber){
//                             clearInterval(topicLoop);
//                             let final ={data:{english:"遊戲結束"}};
//                             io.sockets.in(room).emit("GameTopic",final);
//                         }
//                         else{
//                             topicNumber++;
//                             console.log(topicNumber);
//                             let random=selectRandomWord();
//                             random.then(function(result){
//                                 let {english , chinese , type} =result[0];
//                                 let data = {english,chinese,type,timeOut,topicNumber};
//                                 let final ={data:data};
//                                 io.sockets.in(room).emit("GameTopic",final);
//                                 //場次編號應該為唯一性 況且兩人要相同
//                                 //這裡還要存進DB 場次編號 第幾題 題目是什麼 答對者為null
//                             });
//                         }
//                     },topicTime);


//                     socket.on("battleMessage",function(message){
//                         console.log(message);
//                     });

//                     //遊戲中有人離開就停止
//                     socket.on("disconnect",function(){
//                         clearInterval(topicLoop);
//                         console.log("這裡是在房間內離開");
//                     });
//                 }
//             });










//             socket.on("user1FightMessage",function(msg){
//                 io.sockets.in(room).emit("user1Message",formatMessage(msg));
//                 console.log("user1 Message is "+msg);
//             });
//             socket.on("user2FightMessage",function(msg){
//                 io.sockets.in(room).emit("user2Message",formatMessage(msg));
//                 console.log("user2 Message is "+msg);
//             });
//             //我是玩家的訊息
//             //=====================================================================

            
//         });


//     });
// }



module.exports= {
    socketCon
};