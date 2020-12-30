const { 
    query, 
} =require("../models/mysqlConnect");


const Score=async function(){
    try{
        return await query("SELECT * FROM word.user ORDER BY score desc limit 10 ;");
    }
    catch(error){
        console.log(error);
    }
};

const Buzz=async function(){
    try{
        return await query("SELECT * FROM word.user ORDER BY buzz desc limit 10 ;");
    }
    catch(error){
        console.log(error);
    }
};





module.exports ={
    Score,
    Buzz
};