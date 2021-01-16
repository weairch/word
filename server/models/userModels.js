const { 
    query, 
}=require("./mysqlConnect");


const jwt=require("jsonwebtoken");

const checkUserEmail=async function (email){
    try{
        return await query("select * from user where email=?",email);
    }
    catch(error){
        console.log(error);
    }
};


const insertNativeUserData=async function (name,email,bcryptPwd,login){
    try{
        let res=await query(`INSERT INTO user (name, email, password,login,buzz,score) VALUES ("${name}", "${email}", "${bcryptPwd}" , "${login}",0,0)`);
        return res;
    }
    catch(error){
        console.log(error);
    }
};

const insertFacebookUserData=async function (name,email,login){
    try{
        let res=await query(`INSERT INTO user (name, email,login,buzz,score) VALUES ("${name}", "${email}","${login}",0,0)`);
        return res;
    }
    catch(error){
        console.log(error);
    }
};

const verificationToken=async function(token,secret){
    try{
        let verify=await jwt.verify(token,secret);
        if (verify){
            return verify;
        }
    }
    catch(error){
        console.log("Verify token error");
    }
};


const addUserToStandbyRoom=async function (userId,room,mode,JWT){
    try{
        let res=await query(`INSERT INTO standby_room (uid, room,mode,JWT) VALUES ("${userId}", "${room}","${mode}","${JWT}")`);
        return res;
    }
    catch(error){
        console.log(error);
    }
};

const updateUserReady=async function (id){
    try{
        let res=await query(`UPDATE standby_room SET ready='ready' WHERE (uid="${id}")`);
        return res;
    }
    catch(error){
        console.log(error);
    }
};

const updateUserUnready =async function (id){
    try{
        let res=await query(`UPDATE standby_room SET ready='null' WHERE (uid="${id}")`);
        return res;
    }
    catch(error){
        console.log(error);
    }
};

const checkForDuplicate=async function (room){
    try{
        return await query("SELECT * FROM standby_room where room=?",room);
    }
    catch(error){
        console.log(error);
    }
};

const updateBuzzWin=async function(id){
    try{
        let res=await query ("update user set buzz=buzz+1 where id=?;",id);
        return res;
    }
    catch(error){
        console.log(error);
    }
};

const updateScoreWin=async function(id){
    try{
        let res=await query("update user set score=score+1 where id=?;",id);
        return res;
    }
    catch(error){
        console.log(error);
    }
};

const getScoreWinRat=async function(id){
    try{
        let score=await query("select score from user where id=?",id);
        let scoreTotalWin=parseInt(score[0]["score"]);

        let scorePlayTimes=await query("select count(*) from game_history where uid=? and mode='Score';",id);
        let scorePlayTimesTotla=scorePlayTimes[0]["count(*)"];
        return {scoreTotalWin,scorePlayTimesTotla};
    }
    catch(error){
        console.log(error);
    }
};

const getBuzzWinRat=async function(id){
    try{
        let buzz=await query("select buzz from user where id=?",id);
        let buzzTotalWin=parseInt(buzz[0]["buzz"]);

        let buzzPlayTimes=await query("select count(*) from game_history where uid=? and mode='Buzz';",id);
        let buzzPlayTimesTotla=buzzPlayTimes[0]["count(*)"];
        return {buzzTotalWin,buzzPlayTimesTotla};
    }
    catch(error){
        console.log(error);
    }
};




module.exports ={
    getBuzzWinRat,
    getScoreWinRat,
    updateScoreWin,
    updateBuzzWin,
    checkForDuplicate,
    updateUserUnready,
    updateUserReady,
    verificationToken,
    checkUserEmail,
    insertFacebookUserData,
    insertNativeUserData,
    addUserToStandbyRoom
};