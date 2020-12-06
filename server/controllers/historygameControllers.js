const {
    findHistoryAll,
    findHistorydetail,
}=require("../models/historyModel");

const {
    verificationToken,
}=require("../models/userModels");

const { 
    JWT_SECRET 
} = process.env;



async function historyAll(req,res){
    let token = req.headers.authorization.split(" ")[1];
    let userInformation = await verificationToken(token,JWT_SECRET);
    let { id,name } = userInformation;
    let history =await findHistoryAll(id);

    let sessionAll={};
    for (let i =0;history.length>i;i++){
        let session = history[i].SessionNumber;
        let result=await findHistorydetail(id,session);
        if (result.length){
            sessionAll[history[i].SessionNumber]=history[i].startTime;
        }
    }
    let data = {id,name,session:sessionAll};
    res.json(data);
}

async function historyDetaile(req,res){
    let { userid,session }=req.body;
    let result=await findHistorydetail(userid,session);
    let topic={};
    for (let i=0;result.length>i;i++){
        topic[result[i].topic]=result[i].correct;
    }
    res.json(topic);
}



module.exports={
    historyDetaile,
    historyAll
};