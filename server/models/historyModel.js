const { 
    query 
} = require("../../util/mysqlCon");



const findHistorymulti = async function (id){
    return await query("select * from word.game_history where mode='Multiplayer' and uid = ? ",id);
};

const findHistorysingle = async function (id){
    return await query("select * from word.game_history where mode='single' and uid = ?",id);
};

const findHistorydetail = async function(uid,gid){
    return await query("SELECT * FROM word.game_detail where uid=? and gid=?;",[uid,gid]);
};



module.exports={
    findHistorydetail,
    findHistorymulti,
    findHistorysingle,
};