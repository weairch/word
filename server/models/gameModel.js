const { 
    query, 
    transaction, 
    commit, 
    rollback
} =require("./mysqlConnect");


const {
    random
} = require("../../util/random");


const sqlMaxLength=async function(){
    try{
        let result=await query("select max(id) from word.topic");
        return result[0]["max(id)"];
    }
    catch(error){
        console.log(error);
    }
};

const selectFourRandomWord =async function(){
    try{
        let number=await sqlMaxLength();
        let randomNumber=random(1,number);
        let result= await query("SELECT * FROM word.topic ORDER BY RAND() LIMIT 4",randomNumber);
        return result;
    }
    catch(error){
        console.log(error);
    }
};

const findSessionNumber =async function(uid){
    try{
        let result=await query(`select max(id) from word.game_history where uid="${uid}"`);
        let id=result[0]["max(id)"];
        let session=await query(`select * from word.game_history where uid="${uid}" and id="${id}"`);
        return session[0].SessionNumber;
    }
    catch(error){
        console.log(error);
    }
};

const checkAnswer = async function(englishTopic){
    try{
        return await query("select * from word.topic where english = ?",englishTopic);
    }
    catch(error){
        console.log(error);
    }
};

const insertTopic = async function(uid,gid,topic){
    try{
        await transaction();
        let res=await query("INSERT INTO word.game_detail (`uid`,`gid`,`topic`) VALUES (?,?,?)",[uid,gid,topic]);        
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};

const insertCorrect = async function (uid,session,topic){
    try{
        await transaction();
        let res=await query("update word.game_detail set correct = 'correct' where uid = ? and gid=? and topic=?",[uid,session,topic]);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};

const insertError = async function (uid,session,topic){
    try{
        await transaction();
        await query("select * from word.game_detail where uid=? and gid=? for update;",[uid,session]);
        await query("update word.game_detail set correct = 'error' where uid = ? and gid=? and topic=? ",[uid,session,topic]);
        await commit();
    }
    catch(error){
        await rollback();
        console.log(error);
    }
};

const selectSessionPlayer = async function(session){
    try{
        return await query("select uid from word.game_detail where gid=?",session);
    }
    catch(error){
        console.log(error);
    }
};

const correctAnsrs = async function(id,session){
    try{
        return await query("select count(*) from word.game_detail where uid=? and gid=?",[id,session]);
    }
    catch(error){
        console.log(error);
    }
};

const addSingleModeAndSessions = async function(id,number,startTime,mode){
    try{
        await transaction();
        let res=await query("INSERT INTO word.game_history (`uid`,`SessionNumber`,`mode`,`startTime`) VALUES (?,?,?,?)",[id,number,mode,startTime]);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};


const confirmedWinRate = async function(id,session){
    try{
        return await query("SELECT * FROM word.game_detail where uid = ? and gid =?",[id,session]);
    }
    catch(error){
        console.log(error);
    }
};

const checkCorrectAnswer = async function(id,session){
    try{
        return await query("select count(*) from word.game_detail where  uid=? and gid=? and correct='correct'",[id,session]);
    }
    catch(error){
        console.log(error);
    }
};

const serchStandbyRoom = async function(){
    try{
        return await query ("select room,mode,count(1) from word.standby_room group by room,mode ;");
    }
    catch(error){
        console.log(error);
    }
};

const insertBuzzGame=async function (uid,room){
    try{
        await transaction();
        let res=await query("INSERT INTO word.buzz_game_room (`uid`, `room`,`question_number`,`status`,`currect`) VALUES (?,?,0,'NULL','0');",[uid,room]);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};

const deleteBuzzGame= async function(uid){
    try{
        await transaction();
        let res=await query("DELETE FROM `word`.`buzz_game_room` WHERE (`uid` = ?);",uid);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};


const insertToBuzzGameTopic=async function(session,topicEnglish,topicNumber, topicChinese){
    try{
        await transaction();
        let res=await query("INSERT INTO `word`.`buzz_game_topic` (`session`, `topicEnglish`, `topicNumber`, `topicChinese`) VALUES (?, ?, ?, ?);",[session,topicEnglish,topicNumber,topicChinese]);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};


const deleteBuzzGameTopic=async function(room){
    try{
        await transaction();
        let res=await query("DELETE FROM `word`.`buzz_game_topic` WHERE (`room` = ?);",room);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};


const randomThirtyWord= async function (){
    try{
        return await query("SELECT * FROM word.topic ORDER BY RAND() LIMIT 200;");
    }
    catch(error){
        console.log(error);
    }
};

const buzzTopic = async function(session,topicNumber){
    try{
        return await query(`select * from word.buzz_game_topic where session='${session}' and topicNumber="${topicNumber}";`);
    }
    catch(error){
        console.log(error);
    }
};



const updateTopicNnumber = async function(uid,question_number){
    try{
        await transaction();
        let res=await query("UPDATE `word`.`buzz_game_room` SET `question_number` =? , `status`='NULL' WHERE (`uid` =?);",[question_number,uid]); 
        await commit();
        return res;
    }
    catch(error){
        await rollback();
        console.log(error);
    }
};


const confirmBuzzGameRoomStatus = async function (room,question_number,uid){
    try{
        await transaction();
        let result1 = await query("select count(status) from word.buzz_game_room where room=? and question_number=? and `status`='false' for update;",[room,question_number]);
        let length=result1[0]["count(status)"];
        if (length == 0){
            await query("UPDATE `word`.`buzz_game_room` SET `status` = 'false' WHERE (`uid` = ?)",uid );
            await commit();
            return {message:"update status to false"};
        }
        else{
            await query ("update word.buzz_game_room set question_number=question_number+1 ,status='NULL' where room = ?",room);
            await commit();
            return {message:"Change question"};
        }
    }
    catch(error){
        await rollback();
        return{error};
    }
};

const confirmBuzzGameRoomStatusIsNull = async function (room,question_number){
    try{
        return await query(`select count(status) from word.buzz_game_room where room=${room} and question_number=${question_number} and status= 'null' ;`);
    }
    catch(error){
        console.log(error);
    }
};


const raceCondition= async function(session,topicNumber){
    try{
        await transaction();
        let result=await query("select id from word.buzz_game_topic where session=? and topicNumber=? ;",[session,topicNumber]);
        let id=result[0]["id"];
        let result3=await query("select * from word.buzz_game_topic where `status` is null and id=? FOR UPDATE;",id);
        if (result3 == ""){
            await commit();
            return {message:"false"};
        }
        else if (result3){
            await query("update word.buzz_game_topic set `status`='true' where id=? ;",id);
            await commit();
            return {message:"success"};
        }
    }
    catch(error){
        console.log(error);
        await rollback();
    }

};

const updateCorrectTopicNumber = async function(topicNumber,room){
    try{
        await transaction();
        let res=await query("update word.buzz_game_room set question_number=? , status=NULL where room=?",[topicNumber,room]); 
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};

module.exports ={
    updateCorrectTopicNumber,
    raceCondition,
    confirmBuzzGameRoomStatusIsNull,
    confirmBuzzGameRoomStatus,
    updateTopicNnumber,
    buzzTopic,
    randomThirtyWord,
    insertToBuzzGameTopic,
    deleteBuzzGameTopic,
    deleteBuzzGame,
    insertBuzzGame,
    serchStandbyRoom,
    checkCorrectAnswer,
    confirmedWinRate,
    addSingleModeAndSessions,
    correctAnsrs,
    selectSessionPlayer,
    insertCorrect,
    insertError,
    insertTopic,
    checkAnswer,
    findSessionNumber,
    sqlMaxLength,
    selectFourRandomWord
};