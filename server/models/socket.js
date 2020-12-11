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
    // return new Promise(function(resolve,reject){
    //     let sql = `select * from word.standbyRoom where room ="${room}" and ready="ready";`;
    //     query(sql)
    //         .then(function(result){
    //             resolve (result);
    //         })
    //         .catch(function(err){
    //             reject (err);
    //         });
    // });
}

async function checkBuzzModeAndReady(room){
    return await query("select * from word.standbyRoom where ready='ready' and mode='Buzz' and room=?",room);
}



module.exports={
    checkScoreModeAndReady,
    checkBuzzModeAndReady,
    confirmStart,
    insertSessionToHistory,
    sessionNumber,
    deleteStandbyRoom,
    addSocketId,
    // addNowRoom,
    // leaveRoom,
};