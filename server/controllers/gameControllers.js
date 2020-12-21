const {  
    selectFourRandomWord,
    findSessionNumber,
    checkAnswer,
    insertTopic,
    insertCorrect,
    insertError,
    selectSessionPlayer,
    correctAnsrs,
    addSingleModeAndSessions,
    confirmedWinRate,
    checkCorrectAnswer,
    serchStandbyRoom,
    insertBuzzGame,
    buzzTopic,
    updateTopicNnumber,
    confirmBuzzGameRoomStatus,
    confirmBuzzGameRoomStatusIsNull,
    updataNoResponseTopicNumber,
    checkGameTopicStatus,
    updateGameTopicStatus,
    raceCondition,
} = require("../models/gameModel");


const { 
    random
} = require("../../util/random"); 


const moment = require("moment");

const randomNumber = function (req,res){
    selectFourRandomWord()
        .then(function(result){
            let English=[];
            let Chinese=[];
            let data={English,Chinese};
            for (let i =0;result.length>i ;i++){
                English.push(result[i].english);
                Chinese.push(result[i].chinese);
            }
            return data;
        })
        .then(function(data){
            let topic={};
            let number = random(0,4);
            let english=data.English[number];
            topic.english=english;
            topic.chinese=data.Chinese;
            return topic;
        })
        .then(function(final){
            res.send(final);
        })
        .catch(function(err){
            console.log(err);
            res.send({message:"Server some thing wrong"});
        });
};


const sessionNumber= function (req,res){
    let uid=req.headers.uid;

    findSessionNumber(uid)
        .then(function(sessionNumber){
            res.json(sessionNumber);
        })
        .catch(function(){
            res.json({message:"Some wrong"});
        });

};


const confirmAnswer =async function (req,res){
    let { sessionNumber,english,id,option } = req.body;
    await insertTopic(id,sessionNumber,english);
    let check =await checkAnswer(english);
    let answer = check[0].chinese;
    if (answer == option){
        await insertCorrect(id,sessionNumber,english);
        res.json({message:"correct"});
    }
    else {
        await insertError(id,sessionNumber,english);
        res.json({message:"error"});
    }
};

const lostOrWin= async function (req,res){
    let { uid, Session } = req.body;

    //找出這場所有的玩家
    let player =await selectSessionPlayer(Session);
    let resultplayer=[];
    for (let i=0; player.length>i;i++){
        resultplayer.push(player[i].uid);
    }
    
    //過濾掉重複的值並找到另外一個player
    let playerAll=resultplayer.filter(function(element,index,arr){
        return arr.indexOf(element)===index;
    });
    let index=playerAll.indexOf(uid);
    if (index>-1){
        playerAll.splice(index,1);
    }
    let other = playerAll[0];

    
    let player1 =await correctAnsrs(uid,Session);
    let scorePlayer1=player1[0]["count(*)"];
    let player2 = await correctAnsrs(other,Session);
    let scorePlayer2=player2[0]["count(*)"];
    if (scorePlayer1 > scorePlayer2){
        res.json({message:"Congratulations,you win"});
    }
    else if (scorePlayer1 == scorePlayer2){
        res.json({message:"deuce"});
    }
    else if (scorePlayer1<scorePlayer2){
        res.json({message:"Sorry,you lose"});
    }
    else {
        res.json({message:"Something went wrong, please try again"});
    }
};

const randomSession =async function (req,res){
    let randomSession=random(1,2147483647);
    res.json({randomSession});
};



const addSingleModeAndSession= async function (req,res){
    let { id } = req.body;
    let sessions=req.body.sessionNumber;
    let moments = moment().format("YYYY-MM-DD-HH:mm:ss");
    let mode="single";
    await addSingleModeAndSessions(id,sessions,moments,mode);
    res.json({message:"遊戲資料已記錄"});
};

const checkAll=async function (req,res){
    let { uid,Session } = req.body;
    let result=await confirmedWinRate(uid,Session);
    
    let answer=await checkCorrectAnswer(uid,Session);
    res.json({message:"總共答題了: "+result.length+" 答對了: "+answer[0]["count(*)"]+"題"});
};

const serchRoom = async function (req,res){
    let room =await serchStandbyRoom();
    let roomAll={};
    if (room == ""){
        res.json("");
    }
    else if (room.length){
        for(let i=0;room.length>i;i++){
            if (room[i]["count(1)"]<2){
                roomAll[room[i]["Room"]]=room[i]["mode"];
            }
        }
        res.json(roomAll);
    }
};

const insertBuzzGameInfomation= async function (req,res){
    let id=req.body.user.id;
    let room=req.body.user.room;
    await insertBuzzGame(id,room);

    res.json({message:"inser success"});
};


const gameBuzzTopic= async function (req,res){
    //這裡會收不到其中一個人答錯的東西
    // console.log(req.body);
    let session= req.body.session;
    let topicnumber=req.body.topicNumber;
    let result=await buzzTopic(session,topicnumber);
    let { topicEnglish ,topicNumber} = result[0];
    let string = result[0].topicChinese;
    let topicChinese =JSON.parse(string);
    let topic={topicEnglish,topicChinese,topicNumber};
    
    res.json(topic);

};


const nowGameTopicNnumber= async function (req,res){
    let id = req.body.id;
    let number = req.body.countTopicNumber;
    try {    
        await updateTopicNnumber(id,number);
    }
    catch (err){
        console.log(err);
    }
    res.json({message:"success"});
};



const confirmStatus= async function (req,res){
    let { room ,id} = req.body;
    let Number = req.body.countTopicNumber;
    let countTopicNumber=Number;

    let result = await confirmBuzzGameRoomStatus(room,countTopicNumber,id);
    let message=result.message;
    if (message == "Change question"){
        res.json({message:"false"});
    }
};

// const updataStatusAndNumber =async function (req,res){
//     let {room}=req.body;
//     await updataStatusAndNumberIfError(room);
//     res.json({message:"success"});
// };

const countBuzzGameRoomStatusIsNull=async function (req,res){
    let { room ,countTopicNumber} = req.body;
    console.log(countTopicNumber);
    let status = await confirmBuzzGameRoomStatusIsNull(room,countTopicNumber);
    //代表只要這個題數 有人還在null 代表還有人沒答題
    if (status[0]["count(status)"]){
        res.json({message:"true"});
    }
};

const updataTimeOutTopicNumber=async function (req,res){
    let {id}=req.body;
    await updataNoResponseTopicNumber(id);
    res.json({message:"success"});
};

//=============================沒用了======================
const checkBuzzGameTopicStatus =async function (req,res){
    let { sessionNumber,countTopicNumber } =req.body;
    let result= await checkGameTopicStatus(sessionNumber,countTopicNumber);
    //null代表還沒有更新過 可以去更新並執行下一個動作
    if (result[0]["status"] == null){
        res.json({message:true});
    }
    else{
        res.json({message:false});
    }
};
//=============================沒用了============================================

const updateBuzzGameTopicStatus=async function (req,res){
    let { sessionNumber,countTopicNumber } =req.body;   
    await updateGameTopicStatus(sessionNumber,countTopicNumber);
    res.json({message:"success"});
};

const confirmWhoWillArriveFirst=async function(req,res){
    let { sessionNumber,countTopicNumber}=req.body;
    let result=await raceCondition(sessionNumber,countTopicNumber);
    let {message}=result;
    if (message == "success"){
        res.json({message:true});
    }
    else if(message == "false"){   
        res.json({message:"false"});
    }
};



module.exports ={
    confirmWhoWillArriveFirst,
    checkBuzzGameTopicStatus,
    updateBuzzGameTopicStatus,
    updataTimeOutTopicNumber,
    countBuzzGameRoomStatusIsNull,
    // updataStatusAndNumber,
    confirmStatus,
    nowGameTopicNnumber,
    gameBuzzTopic,
    serchRoom,
    checkAll,
    randomSession,
    addSingleModeAndSession,
    lostOrWin,
    confirmAnswer,
    randomNumber,
    sessionNumber,
    insertBuzzGameInfomation,
    // gameStatus,
};