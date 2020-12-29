const { 
    query, 
} =require("../models/mysqlConnect");


const Score=async function(){
    return await query("SELECT * FROM word.user ORDER BY score desc limit 10 ;");
};

const Buzz=async function(){
    return await query("SELECT * FROM word.user ORDER BY buzz desc limit 10 ;");
};





module.exports ={
    Score,
    Buzz
};