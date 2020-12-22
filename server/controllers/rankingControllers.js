const {
    Score,
    Buzz
}=require("../models/rankingModel");

const scoreRanking=async function (req,res){
    let result=await Score();
    let score=[];
    for (let i=0;result.length>i;i++){
        score.push(result[i]["name"]+","+result[i]["score"]);
    }
    let data={score};

    res.json(data);
};

const buzzRanking=async function(req,res){
    let result=await Buzz();
    let score=[];
    for (let i=0;result.length>i;i++){
        score.push(result[i]["name"]+","+result[i]["buzz"]);
    }
    let data={score};

    
    res.json(data);
};



module.exports={
    scoreRanking,
    buzzRanking
};