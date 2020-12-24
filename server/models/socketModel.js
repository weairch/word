const {
    query
}= require("../../util/mysqlCon");


const deleteStandbyRoom =async function (uid){
    try {
        return await query("delete from word.standbyRoom where uid=?",uid);
    }
    catch(error){
        console.log(error);
    }
    // return new Promise(function(resolve,reject){
    //     let sql = `delete from word.standbyRoom where uid= "${uid}"`;
    //     query(sql)
    //         .then(function(result){
    //             resolve(result);
    //         })
    //         .catch(function(err){
    //             reject(err);
    //         });
    // });
};


const addSocketId=async function(uid,socketId){
    try{
        return await query("update word.user set socketId =? where id =?",[socketId,uid]);
    }
    catch(error){
        console.log(error);
    }
    // return new Promise (function(resolve , reject){
    //     let sql = `update word.user set socketId = "${socketId}" where id = "${uid}"`;
    //     query(sql)
    //         .then(function(result){
    //             resolve (result);
    //         })
    //         .catch(function(err){
    //             reject (err);
    //         });
    // });
};


 
const sessionNumber= async function (room){
    try{
        return await query("select count(*) from word.standbyRoom where room =?;",room);
    }
    catch(error){
        console.log(error);
    }
    // return new Promise(function(resolve , reject){
    //     let sql = `select count(*) from word.standbyRoom where room ="${room}";`;
    //     query(sql)
    //         .then(function(result){
    //             resolve (result);
    //         })
    //         .catch(function(err){
    //             reject (err);
    //         });
    // });
};

const insertSessionToHistory=async function (id,gameNumber,mode,startTime,room){
    try{
        return await query(`INSERT INTO word.game_history (uid,SessionNumber, mode, startTime,Room) VALUES ('${id}','${gameNumber}', '${mode}', '${startTime}',"${room}")`);
    }
    catch(error){
        console.log(error);
    }
    // return new Promise (function(resolve,reject){
    //     let sql = `INSERT INTO word.game_history (uid,SessionNumber, mode, startTime,Room) VALUES ('${id}','${gameNumber}', '${mode}', '${startTime}',"${room}")`;
    //     query(sql)
    //         .then(function(result){
    //             resolve (result);
    //         })
    //         .catch(function(err){
    //             reject(err);
    //         });
    // });
};


const confirmStart=async function (room){
    try{
        return await query("select count(*) from word.standbyRoom where room =?",room);
    }
    catch(error){
        console.log(error);
    }
    // return new Promise (function(resolve,reject){
    //     let sql = `select count(*) from word.standbyRoom where room ="${room}";`;
    //     query(sql)
    //         .then(function(result){
    //             resolve(result);
    //         })
    //         .catch(function(err){
    //             reject(err);
    //         });
    // });
};

const checkScoreModeAndReady =async function (room){
    try {
        return await query("select * from word.standbyRoom where ready='ready' and mode='Score' and room=?",room);
    }
    catch(error){
        console.log(error);
    }
    // return await query("select * from word.standbyRoom where ready='ready' and mode='Score' and room=?",room);
};

const checkBuzzModeAndReady =async function (room){
    try{
        return await query("select * from word.standbyRoom where ready='ready' and mode='Buzz' and room=?",room);
    }
    catch(error){
        console.log(error);
    }
};

const updataCurrectNumber= async function (id){
    try{
        return await query("update word.buzzGameRoom set currect=currect+1 where uid = ?",id);
    }
    catch(error){
        console.log(error);
    }
};

const checkScore =async function (id){
    try{
        return await query("select currect from word.buzzGameRoom where uid=?;",id);
    }
    catch(error){
        console.log(error);
    }
};

const NowStandbyRoomAndMode= async function (){
    try{
        return await query("select Room,mode,count(1) from word.standbyRoom group by Room,mode ;;");
    }
    catch(error){
        console.log(error);
    }
};

const standbyRoomUser= async function (room){
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
};


const confirmStandbyRoomNumber = async function(room){
    try{
        return await query("select count(*) from word.standbyRoom where Room=?",room);
    }
    catch(error){
        console.log(error);
    }
};

module.exports={
    confirmStandbyRoomNumber,
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