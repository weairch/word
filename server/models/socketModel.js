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

async function NowStandbyRoomAndMode(){
    return await query("select Room,mode,count(1) from word.standbyRoom group by Room,mode ;;");
}

async function standbyRoomUser(room){
    try{
        if (room==undefined){
            return;
        }
        else{
            let userNmae=[];
            let res=await query("select * from word.standbyRoom where Room=?",room);
            for (let i=0;res.length>i;i++){
                let user=await query("select name from word.user where id=?",res[i].uid);
                userNmae.push(user[0]["name"]);
            }
            return userNmae;
        }
    }
    catch(error){
        console.log(error);
    }
}


module.exports={
    standbyRoomUser,
    NowStandbyRoomAndMode,
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