const Game=require("../models/gameModel");
const {updateScoreWin} =require("../models/userModels");
const {random}=require("../../util/random"); 
const moment=require("moment");



const getRandomNumber=async function (req,res){
    try{
        let result=await Game.getFourRandomWord();
        let English=[];
        let Chinese=[];
        let data={English,Chinese};
        for (let i=0;result.length>i ;i++){
            English.push(result[i].english);
            Chinese.push(result[i].chinese);
        }
        let topic={};
        let number=random(0,4);
        let english=data.English[number];
        topic.english=english;
        topic.chinese=data.Chinese;
        res.status(200).json(topic);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};


const getSessionNumber=async function (req,res){
    try{
        let uid=req.headers.uid;
        let sessionNumber=await Game.findSessionNumber(uid);
        res.status(200).json(sessionNumber);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};


const confirmAnswer=async function (req,res){
    try{
        let { sessionNumber,english,id,option }=req.body;
        await Game.insertTopic(id,sessionNumber,english);
        let check=await Game.checkAnswer(english);
        let answer=check[0].chinese;
        if (answer == option){
            await Game.insertCorrect(id,sessionNumber,english);
            res.status(200).json({message:"correct"});
        }
        else {
            await Game.insertError(id,sessionNumber,english);
            res.status(200).json({message:"error"});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};

const getLostOrWin=async function (req,res){
    try{
        let { uid, Session }=req.body;
        //Find this game player
        let player=await Game.selectSessionPlayer(Session);
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
        let other=playerAll[0];
      
        let player1=await Game.checkCorrectAnsrs(uid,Session);
        let scorePlayer1=player1[0]["count(*)"];
    
        let player2=await Game.checkCorrectAnsrs(other,Session);
        let scorePlayer2=player2[0]["count(*)"];
    
        if (scorePlayer1 > scorePlayer2){
            await updateScoreWin(uid);
            res.status(200).json({message:"Congratulations,you win"});
        }
        else if (scorePlayer1 == scorePlayer2){
            res.status(200).json({message:"deuce"});
        }
        else if (scorePlayer1<scorePlayer2){
            res.status(200).json({message:"Sorry,you lose"});
        }
        else {
            res.status(500).json({message:"Internal server error"});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};

const getRandomSession=async function (req,res){
    try{
        let randomSession=random(1,2147483647);
        res.status(200).json({randomSession});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};



const addSingleModeAndSession=async function (req,res){
    try{
        let { id }=req.body;
        let sessions=req.body.sessionNumber;
        let moments=moment().format("YYYY-MM-DD-HH:mm:ss");
        let mode="single";
        await Game.addSingleModeAndSessions(id,sessions,moments,mode);
        res.status(200).json({message:"Game data has been recorded"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};

const getSinglePlayerResult=async function (req,res){
    try{
        let { uid,Session }=req.body;
        let result=await Game.confirmedWinRate(uid,Session);
        
        let answer=await Game.checkCorrectAnswer(uid,Session);
        res.status(200).json({message:"A total of answers: "+result.length+" Correct: "+answer[0]["count(*)"]});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};

const serchRoom=async function (req,res){
    try{
        let room=await Game.serchStandbyRoom();
        let roomAll={};
        if (room == ""){
            res.status(200).json("");
        }
        else if (room.length){
            for(let i=0;room.length>i;i++){
                if (room[i]["count(1)"]<2){
                    roomAll[room[i]["room"]]=room[i]["mode"];
                }
            }
            res.status(200).json(roomAll);
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};

const insertBuzzGameInfomation=async function (req,res){
    try{
        let id=req.body.user.id;
        let room=req.body.user.room;
        await Game.insertBuzzGame(id,room);
    
        res.status(200).json({message:"insert success"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};


const getThisSessionBuzzTopic=async function (req,res){
    try{
        let session=req.body.session;
        let topicnumber=req.body.topicNumber;
        let result=await Game.getThisSessionBuzzTopic(session,topicnumber);
        
        let topicNumber=result[0].topic_number;
        let topicEnglish=result[0].topic_english;
        let string=result[0].topic_chinese;
        let topicChinese=JSON.parse(string);
        let topic={topicEnglish,topicChinese,topicNumber};
        
        res.status(200).json(topic);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }

};


module.exports={
    getThisSessionBuzzTopic,
    serchRoom,
    getSinglePlayerResult,
    getRandomSession,
    addSingleModeAndSession,
    getLostOrWin,
    confirmAnswer,
    getRandomNumber,
    getSessionNumber,
    insertBuzzGameInfomation,
};