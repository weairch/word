const {
    query
}= require("../../util/mysqlCon");


function deleteStandbyRoom(uid){
    return new Promise(function(resolve,reject){
        let sql = `delete from word.standbyRoom where uid= "${uid}"`;
        query(sql)
            .then(function(result){
                resolve(result);
            })
            .catch(function(err){
                reject(err);
            });
    });
}


function addSocketId(uid,socketId){
    return new Promise (function(resolve , reject){
        let sql = `update word.user set socketId = "${socketId}" where id = "${uid}"`;
        query(sql)
            .then(function(result){
                resolve (result);
            })
            .catch(function(err){
                reject (err);
            });
    });
}

// function addNowRoom(uid,room){
//     return new Promise (function(resolve,reject){
//         let sql = `update word.user set nowRoom = "${room}" where id = "${uid}"`;
//         query(sql)
//             .then(function(result){
//                 resolve (result);
//             })
//             .catch(function(err){
//                 reject (err);
//             });
//     });
// }

// function leaveRoom(uid){
//     return new Promise(function(resolve,reject){
//         let sql = `update word.user set nowRoom = "null" where id = "${uid}"`;
//         query(sql)
//             .then(function(result){
//                 resolve (result);
//             })
//             .catch(function(err){
//                 reject (err);
//             });
//     });
// }


function sessionNumber(room){
    return new Promise(function(resolve , reject){
        let sql = `select count(*) from word.standbyRoom where room ="${room}";`;
        query(sql)
            .then(function(result){
                resolve (result);
            })
            .catch(function(err){
                reject (err);
            });
    });
}

function insertSessionToHistory(id,gameNumber,mode,startTime,room){
    return new Promise (function(resolve,reject){
        let sql = `INSERT INTO word.game_history (uid,SessionNumber, mode, startTime,Room) VALUES ('${id}','${gameNumber}', '${mode}', '${startTime}',"${room}")`;
        query(sql)
            .then(function(result){
                resolve (result);
            })
            .catch(function(err){
                reject(err);
            });
    });
}


function confirmStart(room){
    return new Promise (function(resolve,reject){
        let sql = `select count(*) from word.standbyRoom where room ="${room}";`;
        query(sql)
            .then(function(result){
                resolve(result);
            })
            .catch(function(err){
                reject(err);
            });
    });
} 

async function checkScoreModeAndReady(room){
    return await query("select * from word.standbyRoom where ready='ready' and mode='Score' and room=?",room);
}

async function checkBuzzModeAndReady(room){
    return await query("select * from word.standbyRoom where ready='ready' and mode='Buzz' and room=?",room);
}

async function updataCurrectNumber(id){
    return await query("update word.buzzGameRoom set currect=currect+1 where uid = ?",id);
}

async function checkScore(id){
    return await query("select currect from word.buzzGameRoom where uid=?;",id);
}

async function checkGameTopicStatus(session,topicNumber){
    return await query("select status from word.buzzGameTopic where session=? and topicNumber=?;",[session,topicNumber]);
}

async function updateGameTopicStatus(session,topicNumber){
    return await query("update word.buzzGameTopic set `status`='true' where `session`=? and `topicNumber`=?;",[session,topicNumber]);
}

module.exports={
    checkGameTopicStatus,
    updateGameTopicStatus,
    checkScore,
    updataCurrectNumber,
    checkScoreModeAndReady,
    checkBuzzModeAndReady,
    confirmStart,
    insertSessionToHistory,
    sessionNumber,
    deleteStandbyRoom,
    addSocketId,

};