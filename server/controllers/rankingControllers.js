const {
    Score,
    Buzz
}=require("../models/rankingModel");

const scoreRanking=async function (req,res){
    try{
        let result=await Score();
        let score=[];
        for (let i=0;result.length>i;i++){
            score.push(result[i]["name"]+","+result[i]["score"]);
        }
        let data={score};
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json("Internal server error.");
    }
};

const buzzRanking=async function(req,res){
    try{
        let result=await Buzz();
        let score=[];
        for (let i=0;result.length>i;i++){
            score.push(result[i]["name"]+","+result[i]["buzz"]);
        }
        let data={score};
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json("Internal server error.");
    }
};



module.exports={
    scoreRanking,
    buzzRanking
};