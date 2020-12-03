const { query }= require("../../util/mysql");

function insertTopic(topic){
    return new Promise(function(resolve,reject){
        let sql =`INSERT INTO word.game_detail (topic) VALUES ('${topic}')`;
        query(sql,function(err,result){
            resolve (result);
            reject (err);
        });
    });
}

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

function addNowRoom(uid,room){
    return new Promise (function(resolve,reject){
        let sql = `update word.user set nowRoom = "${room}" where id = "${uid}"`;
        query(sql)
            .then(function(result){
                resolve (result);
            })
            .catch(function(err){
                reject (err);
            });
    });
}

function leaveRoom(uid){
    return new Promise(function(resolve,reject){
        let sql = `update word.user set nowRoom = "null" where id = "${uid}"`;
        query(sql)
            .then(function(result){
                resolve (result);
            })
            .catch(function(err){
                reject (err);
            });
    });
}


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

function insertSessionToHistory(id,gameNumber,mode,startTime,Room){
    return new Promise (function(resolve,reject){
        let sql = `INSERT INTO word.game_history (uid,SessionNumber, mode, startTime, Room) VALUES ('${id}','${gameNumber}', '${mode}', '${startTime}', '${Room}')`;
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

function checkReady(room){
    return new Promise(function(resolve,reject){
        let sql = `select * from word.standbyRoom where room ="${room}" and ready="ready";`;
        query(sql)
            .then(function(result){
                resolve (result);
            })
            .catch(function(err){
                reject (err);
            });
    });
}

module.exports={
    checkReady,
    confirmStart,
    insertSessionToHistory,
    sessionNumber,
    insertTopic,
    deleteStandbyRoom,
    addSocketId,
    addNowRoom,
    leaveRoom,
};