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
        let sql = `INSERT INTO word.user (name, email, password,login) VALUES ("${name}", "${email}", "${bcryptPwd}" , "${login}")`;
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

function userInStandbyRoom(userId,room,mode){
    return new Promise (function(resolve,reject){
        let sql = `INSERT INTO word.standbyRoom (uid, room,mode) VALUES ("${userId}", "${room}","${mode}")`;
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


module.exports ={
    CheckForDuplicate,
    userUnReady,
    userReady,
    verificationToken,
    checkUser,
    insertUserData,
    userInStandbyRoom
};