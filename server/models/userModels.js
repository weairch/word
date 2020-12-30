const { 
    query, transaction, commit, rollback
} = require("./mysqlConnect");


const jwt = require("jsonwebtoken");

const checkUser= async function (email){
    try{
        return await query("select * from word.user where email = ?",email);
    }
    catch(error){
        console.log(error);
    }
};


const insertUserData= async function (name,email,bcryptPwd,login){
    try{
        await transaction();
        let res=await query(`INSERT INTO word.user (name, email, password,login,buzz,score) VALUES ("${name}", "${email}", "${bcryptPwd}" , "${login}","0","0")`);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};

const verificationToken=async function(token,secret){
    try{
        let verify= await jwt.verify(token,secret);
        if (verify){
            return verify;
        }
    }
    catch(error){
        console.log("Verify token error");
    }
};


const userInStandbyRoom=async function (userId,room,mode,JWT){
    try{
        await transaction();
        let res=await query(`INSERT INTO word.standby_room (uid, room,mode,JWT) VALUES ("${userId}", "${room}","${mode}","${JWT}")`);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};

const userReady=async function (id){
    try{
        await transaction();
        let res=await query(`UPDATE word.standby_room SET ready = 'ready' WHERE (uid = "${id}")`);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};

const userUnReady =async function (id){
    try{
        await transaction();
        let res=await query(`UPDATE word.standby_room SET ready = 'null' WHERE (uid = "${id}")`);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};

async function CheckForDuplicate(room){
    try{
        return await query("SELECT * FROM word.standby_room where room=?",room);
    }
    catch(error){
        console.log(error);
    }
}

const buzzWin=async function(id){
    try{
        await transaction();
        let res=await query ("update word.user set buzz=buzz+1 where id = ?;",id);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};

const scoreWin=async function(id){
    try{
        await transaction();
        let res=await query("update word.user set score=score+1 where id = ?;",id);
        await commit();
        return res;
    }
    catch(error){
        console.log(error);
        await rollback();
    }
};

const scoreWinRat=async function(id){
    try{
        let score=await query("select score from word.user where id=?",id);
        let scoreTotalWin=parseInt(score[0]["score"]);

        let scorePlayTimes=await query("select count(*) from word.game_history where uid=? and mode='Score';",id);
        let scorePlayTimesTotla=scorePlayTimes[0]["count(*)"];
        return {scoreTotalWin,scorePlayTimesTotla};
    }
    catch(error){
        console.log(error);
    }
};

const buzzWinRat=async function(id){
    try{
        let buzz=await query("select buzz from word.user where id=?",id);
        let buzzTotalWin=parseInt(buzz[0]["buzz"]);

        let buzzPlayTimes=await query("select count(*) from word.game_history where uid=? and mode='Buzz';",id);
        let buzzPlayTimesTotla=buzzPlayTimes[0]["count(*)"];
        return {buzzTotalWin,buzzPlayTimesTotla};
    }
    catch(error){
        console.log(error);
    }
};



module.exports ={
    buzzWinRat,
    scoreWinRat,
    scoreWin,
    buzzWin,
    CheckForDuplicate,
    userUnReady,
    userReady,
    verificationToken,
    checkUser,
    insertUserData,
    userInStandbyRoom
};