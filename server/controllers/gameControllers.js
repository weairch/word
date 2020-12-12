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
    // randomThirtyWord,
    buzzTopic,
    updateTopicNnumber,
    updataTopicError,
    confirmBuzzGameRoomStatus,
    updataStatusAndNumberIfError,
} = require("../models/gameModel");


const { 
    random
} = require("../../util/random"); 


const moment = require("moment");

function randomNumber(req,res){
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
}


function sessionNumber(req,res){
    let uid=req.headers.uid;

    findSessionNumber(uid)
        .then(function(sessionNumber){
            res.json(sessionNumber);
        })
        .catch(function(){
            res.json({message:"Some wrong"});
        });

}


async function confirmAnswer(req,res){
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
}

async function lostOrWin(req,res){
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
}

async function randomSession(req,res){
    let randomSession=random(1,2147483647);
    res.json({randomSession});
}



async function addSingleModeAndSession(req,res){
    let { id } = req.body;
    let sessions=req.body.sessionNumber;
    let moments = moment().format("YYYY-MM-DD-HH:mm:ss");
    let mode="single";
    await addSingleModeAndSessions(id,sessions,moments,mode);
    res.json({message:"遊戲資料已記錄"});
}

async function checkAll (req,res){
    let { uid,Session } = req.body;
    let result=await confirmedWinRate(uid,Session);
    
    let answer=await checkCorrectAnswer(uid,Session);
    res.json({message:"總共答題了: "+result.length+" 答對了: "+answer[0]["count(*)"]+"題"});
}

async function serchRoom(req,res){
    let room =await serchStandbyRoom();
    let roomALL={};
    if (room == ""){
        res.json({message:"目前沒有人開啟房間"});
    }
    else if (room.length){
        for (let i=0 ; room.length>i ;i++ ){
            roomALL["room"+i]=room[i].Room;
        }
        res.json(roomALL);
    }
   
}

async function insertBuzzGameInfomation(req,res){
    let id=req.body.user.id;
    let room=req.body.user.room;
    await insertBuzzGame(id,room);

    res.json({message:"inser success"});
}


async function gameBuzzTopic(req,res){
    // console.log(req.headers);
    let session= req.headers.session;
    let topicnumber=req.headers.topicnumber;
    let result=await buzzTopic(session,topicnumber);
    
    let { topicEnglish ,topicNumber} = result[0];
    let string = result[0].topicChinese;
    let topicChinese =JSON.parse(string);
    let topic={topicEnglish,topicChinese,topicNumber};
    
    res.json(topic);
}


async function nowGameTopicNnumber(req,res){
    let id = req.body.id;
    let number = req.body.countTopicNumber;
    await updateTopicNnumber(id,number);
    res.json({message:"success"});
}

async function gameStatus(req,res){
    let id=req.body.id;
    let status=req.body.status;
    await updataTopicError(id,status);
    res.json({mesage:"success"});

}

async function confirmStatus(req,res){
    let { room , countTopicNumber } = req.body;
    let result = await confirmBuzzGameRoomStatus(room,countTopicNumber);
    if (result[0]["count(status)"] == 0){
        res.json({message:"true"});
    }
    else {
        res.json({message:"false"});
    }
}

async function updataStatusAndNumber(req,res){
    let {room}=req.body;
    await updataStatusAndNumberIfError(room);
    res.json({message:"success"});
}

module.exports ={
    updataStatusAndNumber,
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
    gameStatus,
};