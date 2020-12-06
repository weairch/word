const {  
    selectFourRandomWord,
    findSessionNumber,
    checkAnswer,
    insertTopic,
    insertCorrect,
    insertError,
    selectSessionPlayer,
    correctAnsrs
} = require("../models/gameModel");


const { 
    random
} = require("../../util/random"); 


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
        await insertCorrect(id,sessionNumber);
        res.json({message:"correct"});
    }
    else {
        await insertError(id,sessionNumber);
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


module.exports ={
    lostOrWin,
    confirmAnswer,
    randomNumber,
    sessionNumber
};