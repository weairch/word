require('dotenv').config();
const mysql = require('mysql');
const {DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE} = process.env
const {promisify} = require('util');

const mysqlConfig = {
    connectionLimit : 10,
    host : DB_HOST,
    user : DB_USERNAME,
    password : DB_PASSWORD,
    database : DB_DATABASE, 
}

const mysqlCon = mysql.createPool(mysqlConfig);

const promiseQuery = promisify(mysqlCon.query).bind(mysqlCon);
const promiseTransaction = promisify(mysqlCon.beginTransaction).bind(mysqlCon);
const promiseCommit = promisify(mysqlCon.commit).bind(mysqlCon);
const promiseRollback = promisify(mysqlCon.rollback).bind(mysqlCon);
const promiseEnd = promisify(mysqlCon.end).bind(mysqlCon);

module.exports={
	core: mysql,
    query: promiseQuery,
    transaction: promiseTransaction,
    commit: promiseCommit,
    rollback: promiseRollback,
    end: promiseEnd,
};