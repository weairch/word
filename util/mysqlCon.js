require("dotenv").config();
const mysql = require("mysql");


const { DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE 
} = process.env;

const mysqlConfig = {
    connectionLimit : 10,
    host : DB_HOST,
    user : DB_USERNAME,
    password : DB_PASSWORD,
    database : DB_DATABASE, 
};

const mysqlCon = mysql.createPool(mysqlConfig);

function promiseQuery (sql,value){
    return new Promise (function(resolve,reject){
        mysqlCon.query(sql,value,function(err,result){
            if (err){
                reject (err);
            }
            else{
                resolve (result);
            }
        });
    });
}


module.exports={
    core: mysql,
    query: promiseQuery,
    // transaction: promiseTransaction,
    // commit: promiseCommit,
    // rollback: promiseRollback,
    // end: promiseEnd,
};