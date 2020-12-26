const { 
    query
} = require("../../util/mysqlCon");


const jwt = require("jsonwebtoken");

function checkUser(email){
    return new Promise(function(resolve,reject){
        let sql = "select * from word.user where email = ?";
        query(sql,email)
            .then(function(res){
                resolve (res);
            })
            .catch(function(err){
                reject (err);
            });
    });
}


function insertUserData(name,email,bcryptPwd,login){
    return new Promise(function(resolve,reject){
        let sql = `INSERT INTO word.user (name, email, password,login,buzz,score) VALUES ("${name}", "${email}", "${bcryptPwd}" , "${login}","0","0")`;
        query(sql)
            .then(function(result){
                resolve(result);
            })
            .catch(function(err){
                reject(err);
            });
    });
}


function verificationToken(token,secret){
    return new Promise (function(resolve , reject){
        let verify=jwt.verify(token,secret);
        if (verify){
            resolve (verify);
        }
        else{
            reject (verify);
        }
    });
}

function userInStandbyRoom(userId,room,mode,JWT){
    return new Promise (function(resolve,reject){
        let sql = `INSERT INTO word.standbyRoom (uid, room,mode,JWT) VALUES ("${userId}", "${room}","${mode}","${JWT}")`;
        query(sql)
            .then(function(result){
                resolve (result);
            })
            .catch(function(err){
                reject (err);
            });
    });
}

function userReady(id){
    return new Promise (function(resolve,reject){
        let sql = `UPDATE word.standbyRoom SET ready = 'ready' WHERE (uid = "${id}")`;
        query(sql)
            .then(function(result){
                resolve(result);
            })
            .catch(function(err){
                reject(err);
            });
    });
}

function userUnReady(id){
    return new Promise(function(resolve,reject){
        let sql = `UPDATE word.standbyRoom SET ready = 'null' WHERE (uid = "${id}")`;
        query(sql)
            .then(function(result){
                resolve(result);
            })
            .catch(function(err){
                reject(err);
            });
    });
}

async function CheckForDuplicate(room){
    return await query("SELECT * FROM word.standbyRoom where Room=?",room);
}

const buzzWin=async function(id){
    return await query ("update word.user set buzz=buzz+1 where id = ?;",id);
};

const scoreWin=async function(id){
    return await query("update word.user set score=score+1 where id = ?;",id);
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