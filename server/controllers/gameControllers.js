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
} = require("../models/gameModel");

const {
    scoreWin
} =require("../models/userModels");


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

    //Find this game player
    let player =await selectSessionPlayer(Session);
    let resultplayer=[];
    for (let i=0; player.length>i;i++){
        resultplayer.push(player[i].uid);
    }
    
    //find other player
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
        await scoreWin(uid);
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
    res.json({message:"Game data has been recorded"});
};

const checkAll=async function (req,res){
    let { uid,Session } = req.body;
    let result=await confirmedWinRate(uid,Session);
    
    let answer=await checkCorrectAnswer(uid,Session);
    res.json({message:"A total of answers: "+result.length+" Correct: "+answer[0]["count(*)"]});
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
                roomAll[room[i]["room"]]=room[i]["mode"];
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
    let session= req.body.session;
    let topicnumber=req.body.topicNumber;
    let result=await buzzTopic(session,topicnumber);
    let { topicEnglish ,topicNumber} = result[0];
    let string = result[0].topicChinese;
    let topicChinese =JSON.parse(string);
    let topic={topicEnglish,topicChinese,topicNumber};
    
    res.json(topic);

};


module.exports ={
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
};