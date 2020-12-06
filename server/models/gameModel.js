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
                // let sql="select * from word.English3000 where id =?";
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
        let sql = `select max(startTime) from word.game_history where uid="${uid}"`;
        query(sql)
            .then(function(result){
                return (result[0]["max(startTime)"]);
            })
            .then(function(time){
                let sql = `select * from word.game_history where uid="${uid}" and startTime="${time}"`; 
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

const insertCorrect = async function (uid,session){
    return await query("update word.game_detail set correct = 'correct' where uid = ? and gid=?",[uid,session]);
};

const insertError = async function (uid,session){
    return await query("update word.game_detail set correct = 'error' where uid = ? and gid=?",[uid,session]);
};

const selectSessionPlayer = async function(session){
    return await query("select uid from word.game_detail where gid=?",session);
};

const correctAnsrs = async function(id,session){
    return await query("select count(*) from word.game_detail where uid=? and gid=?",[id,session]);
};


module.exports ={
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