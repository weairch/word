require("dotenv").config();
const mysql=require("mysql");
const {promisify}=require("util");
const { DB_HOST,DB_USERNAME,DB_PASSWORD,DB_DATABASE,NODE_ENV,DB_TEST_DATABASE}=process.env;

const mysqlConfig={
    
    develop:{
        connectionLimit : 10,
        host : DB_HOST,
        user : DB_USERNAME,
        password : DB_PASSWORD,
        database : DB_DATABASE, 
    },
    test:{
        connectionLimit : 10,
        host : DB_HOST,
        user : DB_USERNAME,
        password : DB_PASSWORD,
        database : DB_TEST_DATABASE, 
    }
};


const mysqlCon=mysql.createConnection(mysqlConfig[NODE_ENV]);





const promiseQuery=promisify(mysqlCon.query).bind(mysqlCon);
const promiseTransaction=promisify(mysqlCon.beginTransaction).bind(mysqlCon);
const promiseCommit=promisify(mysqlCon.commit).bind(mysqlCon);
const promiseRollback=promisify(mysqlCon.rollback).bind(mysqlCon);
const promiseEnd=promisify(mysqlCon.end).bind(mysqlCon);


module.exports={
    core: mysql,
    query: promiseQuery,
    transaction: promiseTransaction,
    commit: promiseCommit,
    rollback: promiseRollback,
    end: promiseEnd,
};