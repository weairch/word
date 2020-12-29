const {
    query, 
    transaction, 
    commit, 
    rollback
}= require("./mysqlConnect");


const deleteStandbyRoom =async function (uid){
    try {
        await transaction();
        let res= await query("delete from word.standbyRoom where uid=?",uid);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }

};


const addSocketId=async function(uid,socketId){
    try{
        await transaction();
        let res=await query("update word.user set socketId =? where id =?",[socketId,uid]);
        await commit();
        return res;
    }
    catch(error){
        await rollback();
        console.log(error);
    }
};


 
const sessionNumber= async function (room){
    try{
        return await query("select count(*) from word.standbyRoom where room =?;",room);
    }
    catch(error){
        console.log(error);
    }
};

const insertSessionToHistory=async function (id,gameNumber,mode,startTime,room){
    try{
        await transaction();
        let res=await query(`INSERT INTO word.game_history (uid,SessionNumber, mode, startTime,Room) VALUES ('${id}','${gameNumber}', '${mode}', '${startTime}',"${room}")`);
        await commit();
        return res;
    }
    catch(error){
        await rollback();
        console.log(error);
    }
};


const confirmStart=async function (room){
    try{
        return await query("select count(*) from word.standbyRoom where room =?",room);
    }
    catch(error){
        console.log(error);
    }
};

const checkScoreModeAndReady =async function (room){
    try {
        return await query("select * from word.standbyRoom where ready='ready' and mode='Score' and room=?",room);
    }
    catch(error){
        console.log(error);
    }
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
        await transaction();
        let res=await query("update word.buzzGameRoom set currect=currect+1 where uid = ?",id);
        await commit();
        return res;
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
            let userName=[];
            let res=await query("select * from word.standbyRoom where Room=?",room);
            for (let i=0;res.length>i;i++){
                let user=await query("select name from word.user where id=?",res[i].uid);
                userName.push(user[0]["name"]);
            }
            return userName;
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