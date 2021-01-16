const {
    query, 
}=require("./mysqlConnect");


const deleteStandbyRoom=async function (uid){
    try {
        let res=await query("delete from standby_room where uid=?",uid);
        return res;
    }
    catch(error){
        console.log(error);
    }

};


const addSocketId=async function(uid,socketId){
    try{
        let res=await query("update user set socketId =? where id =?",[socketId,uid]);
        return res;
    }
    catch(error){
        console.log(error);
    }
};


 
const sessionNumber=async function (room){
    try{
        return await query("select count(*) from standby_room where room =?;",room);
    }
    catch(error){
        console.log(error);
    }
};

const insertSessionToHistory=async function (id,gameNumber,mode,startTime,room){
    try{
        let res=await query(`INSERT INTO game_history (uid,session_number, mode, start_time,room) VALUES ('${id}','${gameNumber}', '${mode}', '${startTime}',"${room}")`);
        return res;
    }
    catch(error){
        console.log(error);
    }
};


const confirmStart=async function (room){
    try{
        return await query("select count(*) from standby_room where room =?",room);
    }
    catch(error){
        console.log(error);
    }
};

const checkScoreModeAndReady=async function (room){
    try {
        return await query("select * from standby_room where ready='ready' and mode='Score' and room=?",room);
    }
    catch(error){
        console.log(error);
    }
};

const checkBuzzModeAndReady=async function (room){
    try{
        return await query("select * from standby_room where ready='ready' and mode='Buzz' and room=?",room);
    }
    catch(error){
        console.log(error);
    }
};

const updataCurrectNumber=async function (id){
    try{
        let res=await query("update buzz_game_room set currect=currect+1 where uid=?",id);
        return res;
    }
    catch(error){
        console.log(error);
    }
};

const checkScore=async function (id){
    try{
        return await query("select currect from buzz_game_room where uid=?;",id);
    }
    catch(error){
        console.log(error);
    }
};

const NowStandbyRoomAndMode=async function (){
    try{
        return await query("select room,mode,count(1) from standby_room group by room,mode ;;");
    }
    catch(error){
        console.log(error);
    }
};

const standbyRoomUser=async function (room){
    try{
        if (room==undefined){
            return;
        }
        else{
            let userName=[];
            let res=await query("select * from standby_room where room=?",room);
            for (let i=0;res.length>i;i++){
                let user=await query("select name from user where id=?",res[i].uid);
                userName.push(user[0]["name"]);
            }
            return userName;
        }
    }
    catch(error){
        console.log(error);
    }
};


const confirmStandbyRoomNumber=async function(room){
    try{
        return await query("select count(*) from standby_room where room=?",room);
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