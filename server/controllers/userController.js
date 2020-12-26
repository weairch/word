require("dotenv").config();
const validator = require("validator");

const { 
    checkUser,
    insertUserData,
    verificationToken,
    CheckForDuplicate,
    scoreWinRat,
    buzzWinRat
}     
    = require("../models/userModels");


const { 
    JWT_SECRET 
} = process.env;

const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");


function signIn(req,res){
    let {password , email } = req.body;
    if (!password.length || !email.length ){
        return res.status(500).send ({message:"Please enter the correct format"});
    }

    checkUser(email)
        .then(function(result){
            if (result.length == 0){
                return Promise.reject() ;
            }
            else {
                return result;
            }
        })
        .then(async function(result){
            let hashPwd=result[0].password;
            let bcryptPwd = await bcrypt.compare(password,hashPwd);
            let data = [result,bcryptPwd];
            return data ;
        })
        .then(function(result){
            if (result[1] == false){
                res.status(500).send({message:"Please enter correct Email or password"});
            }
            else {
                let { id,name,email,socketId } = result[0][0];
                let payload ={id,name,email,socketId};
                let token = jwt.sign(payload,JWT_SECRET,{expiresIn:"1 day"});
                res.status(200).json(token);
            }
        })
        .catch(function(){
            return res.status(500).send({message:"Please enter correct Email or password"});
        });
}


async function signUp(req,res){
    try{
        let {name,password,email} = req.body;
        if (!name.length || !password.length || !email.length ){
            return res.status(500).send ({message:"Please enter the correct format"});
        }
        if (email){
            let checkEmail=validator.isEmail(email);
            if (checkEmail == false){
                return res.status(500).send ({message:"Please enter the correct email format"}) ;
            }
        }
        let result=await checkUser(email);
        if (result.length >0){
            return res.status(500).send ({message:"Email already exists"}) ;
        }
        else{
            let hashPwd=await bcrypt.hash(password,8);
            await insertUserData(name,email,hashPwd,"native");
            let user=await checkUser(email);
            let userId=user[0].id;
            let userName=user[0].name;
            let userEmail=user[0].email;
            let payload={id:userId,name:userName,email:userEmail};
            let token = jwt.sign(payload,JWT_SECRET,{expiresIn:"1 day"});
            return res.status(200).send({message:"signup success",token:token});
        }
    }
    catch{
        return res.status(500).send ({message:"Email already exists"}) ;
    }
}

function checkUserToken (req,res){
    let bearerHeader = req.get("Authorization");
    let bearerToken = bearerHeader.split(" ")[1];
    if (bearerToken !== "null"){
        verificationToken(bearerToken,JWT_SECRET)
            .then(function(result){
                let {id,name}=result;
                res.send({Token:"user is OK , aleard signin",id,name});
            })
            .catch(function(){
                res.status(403).json({message:"Pleast signin first"});
            });
    }
    else{
        res.status(403).json({message:"Pleast signin first"});
    }
}

function sqlAddStandbyRoom(req,res){
    let {mode} = req.body;
    let roomNum=req.body.room;
    let token = req.get("Authorization").split(" ")[1];
    verificationToken(token,JWT_SECRET)
        .then(function(payload){
            payload.room=roomNum;
            payload.mode=mode;
            let newJWT=jwt.sign(payload,JWT_SECRET);
            res.json(newJWT);
        });
}

function userIdAndNowRoom(req,res){
    let token = req.get("Authorization").split(" ")[1];
    verificationToken(token,JWT_SECRET)
        .then(function(payload){
            let { id ,name, room } = payload;
            res.json({id,name,room});
        });
}


function needInformationStartGame(req,res){
    let token = req.get("Authorization").split(" ")[1]; 
    verificationToken(token,JWT_SECRET)
        .then(function(payload){
            let { id ,name,room,player} = payload;
            res.json({id,name,room,player});
        });
}

async function checkStandbyRoomModeAndRoom(req,res){
    let {mode,roomNum} =req.body;
    let check=await CheckForDuplicate(roomNum);
    if (check == ""){
        res.json({message:"Confirm entry"});
    }
    else if (check[0].mode == mode){
        res.json({message:"Confirm entry"});
    }
    else{
        res.json({message:"This room is a different model"});
    }
}



async function profileWinRat(req,res){
    let id=req.headers.id;
    let score=await scoreWinRat(id);
    
    let buzz=await buzzWinRat(id);
    let data={score,buzz};

    res.json(data);
}








module.exports={
    signIn,
    signUp,
    checkUserToken,
    sqlAddStandbyRoom,
    userIdAndNowRoom,
    needInformationStartGame,
    checkStandbyRoomModeAndRoom,
    profileWinRat
};




