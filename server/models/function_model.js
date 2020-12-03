const { query } =require("../../util/mysql");
const { random } = require("../../util/random");



function sqlMaxLength(){
    return new Promise (function(resolve,reject){
        let sql = "select max(id) from word.English3000";
        query(sql)
            .then(function(result){
                resolve(result[0]["max(id)"]); 
            })
            .catch(function(err){
                reject(err);
            });
    });
}

function selectRandomWord(){
    return new Promise (function(resolve,reject){
        sqlMaxLength()
            .then(function(number){
                let randomNumber = random(1,number);
                let sql="select * from word.English3000 where id =?";
                query(sql,randomNumber)
                    .then(function(result){
                        resolve (result);
                    })
                    .catch(function(err){
                        reject (err);
                    });
            });
    });
}



module.exports ={
    sqlMaxLength,
    selectRandomWord
};