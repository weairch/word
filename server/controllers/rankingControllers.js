const Ranking=require("../models/rankingModel");




const getScoreRanking=async function (req,res){
    try{
        let result=await Ranking.getRankingScore();
        let score=[];
        for (let i=0;result.length>i;i++){
            score.push(result[i]["name"]+","+result[i]["score"]);
        }
        let data={score};
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
};

const getBuzzRanking=async function(req,res){
    try{
        let result=await Ranking.getRankingBuzz();
        let score=[];
        for (let i=0;result.length>i;i++){
            score.push(result[i]["name"]+","+result[i]["buzz"]);
        }
        let data={score};
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
};



module.exports={
    getScoreRanking,
    getBuzzRanking
};