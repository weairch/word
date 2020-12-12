const { 
    query
} =require("../../util/mysqlCon");


const {
    random
} = require("../../util/random");



function sqlMaxLength(){
    return new Promise (function(resolve,reject){
        let sql = "select max(id) from word.English3000";
        query(sql)
            .then(function(result){
                resolve(result[0]["max(id)"]); 
            })
            .catch(function(err){
                reject(err);
            });
    });
}

function selectFourRandomWord(){
    return new Promise (function(resolve,reject){
        sqlMaxLength()
            .then(function(number){
                let randomNumber = random(1,number);
                let sql = "SELECT * FROM word.English3000 ORDER BY RAND() LIMIT 4";
                query(sql,randomNumber)
                    .then(function(result){
                        resolve (result);
                    })
                    .catch(function(err){
                        reject (err);
                    });
            });
    });
}

function findSessionNumber(uid){
    return new Promise(function(resolve,reject){
        let sql = `select max(id) from word.game_history where uid="${uid}"`;
        query(sql)
            .then(function(result){
                return (result[0]["max(id)"]);
            })
            .then(function(id){
                let sql = `select * from word.game_history where uid="${uid}" and id="${id}"`; 
                query(sql)
                    .then(function(result){
                        resolve(result[0].SessionNumber);
                    })
                    .catch(function(err){
                        reject(err);
                    });
            })
            .catch(function(err){
                reject (err);
            });
    });
}


const checkAnswer = async function(englishTopic){
    return await query("select * from word.English3000 where english = ?",englishTopic);
};

const insertTopic = async function(uid,gid,topic){
    return await query("INSERT INTO word.game_detail (`uid`,`gid`,`topic`) VALUES (?,?,?)",[uid,gid,topic]);
};

const insertCorrect = async function (uid,session,topic){
    return await query("update word.game_detail set correct = 'correct' where uid = ? and gid=? and topic=?",[uid,session,topic]);
};

const insertError = async function (uid,session,topic){
    return await query("update word.game_detail set correct = 'error' where uid = ? and gid=? and topic=?",[uid,session,topic]);
};

const selectSessionPlayer = async function(session){
    return await query("select uid from word.game_detail where gid=?",session);
};

const correctAnsrs = async function(id,session){
    return await query("select count(*) from word.game_detail where uid=? and gid=?",[id,session]);
};

const addSingleModeAndSessions = async function(id,number,startTime,mode){
    return await query("INSERT INTO word.game_history (`uid`,`SessionNumber`,`mode`,`startTime`) VALUES (?,?,?,?)",[id,number,mode,startTime]);
};


const confirmedWinRate = async function(id,session){
    return await query("SELECT * FROM word.game_detail where uid = ? and gid =?",[id,session]);
};

const checkCorrectAnswer = async function(id,session){
    return await query("select count(*) from word.game_detail where  uid=? and gid=? and correct='correct'",[id,session]);
};

const serchStandbyRoom = async function(){
    return await query ("select * from word.standbyRoom");
};

const insertBuzzGame=async function (uid,room){
    return await query("INSERT INTO word.buzzGameRoom (`uid`, `Room`,`questionNumber`) VALUES (?,?,0);",[uid,room]);
};

const deleteBuzzGame= async function(uid){
    return await query("DELETE FROM `word`.`buzzGameRoom` WHERE (`uid` = ?);",uid);
};


const insertToBuzzGameTopic=async function(session,topicEnglish,topicNumber, topicChinese){
    return await query("INSERT INTO `word`.`buzzGameTopic` (`session`, `topicEnglish`, `topicNumber`, `topicChinese`) VALUES (?, ?, ?, ?);",[session,topicEnglish,topicNumber,topicChinese]);
};


const deleteBuzzGameTopic=async function(room){
    return await query("DELETE FROM `word`.`buzzGameTopic` WHERE (`Room` = ?);",room);
};


const randomThirtyWord= async function (){
    return await query("SELECT * FROM word.English3000 ORDER BY RAND() LIMIT 30;");
};

const buzzTopic = async function(session,topicNumber){
    return await query(`select * from word.buzzGameTopic where session=${session} and topicNumber="${topicNumber}";`);
};


const updateTopicNnumber = async function(uid,questionNumber){
    return await query("UPDATE `word`.`buzzGameRoom` SET `questionNumber` =? , `status`='null' WHERE (`uid` =?);",[questionNumber,uid]); 
};

const updataTopicError = async function (uid,status){
    return await query ("UPDATE `word`.`buzzGameRoom` SET `status` = ? WHERE (`uid` = ?)",[status,uid]);
};

const confirmBuzzGameRoomStatus = async function (room,questionNumber){
    return await query("select count(status) from word.buzzGameRoom where Room=? and questionNumber=? and `status`='false';",[room,questionNumber]);
};

const updataStatusAndNumberIfError = async function (room){
    return await query("update word.buzzGameRoom set questionNumber=questionNumber+1 ,status='null' where Room = ?;",room);
};

module.exports ={
    updataStatusAndNumberIfError,
    confirmBuzzGameRoomStatus,
    updataTopicError,
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