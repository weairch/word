const { 
    query 
} = require("../../util/mysqlCon");



const findHistoryAll = async function (id){
    return await query("select * from word.game_history where uid = ?",id);
};


const findHistorydetail = async function(uid,gid){
    return await query("SELECT * FROM word.game_detail where uid=? and gid=?;",[uid,gid]);
};



module.exports={
    findHistorydetail,
    findHistoryAll
};