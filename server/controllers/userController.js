require("dotenv").config();
const validator = require("validator");
const User = require("../models/userModels");
const { JWT_SECRET } = process.env;
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");


const signIn=async function (req,res){
    try{
        let {password , email } = req.body;
        if (!password.length || !email.length ){
            return res.status(400).send ({message:"Please enter the correct format"});
        }
        let user=await User.checkUserEmail(email);
        
        if (user.length == 0){
            return res.status(400).send({message:"Please enter correct Email or password"});
        }
    
        let hashPwd=user[0].password;
        let bcryptPwd = await bcrypt.compare(password,hashPwd);
        if (bcryptPwd == false){
            return res.status(500).send({message:"Please enter correct Email or password"});
        }
        let { id,name,socketId } = user[0];
        let payload ={id,name,email,socketId};
        let token = jwt.sign(payload,JWT_SECRET,{expiresIn:"1 day"});

        res.status(200).json({message:"Signin success",token});
    }
    catch(error){
        console.log(error);
        return res.status(500).send({message:"Internal server error."});
    }
};


const signUp=async function (req,res){
    try{
        let {name,password,email} = req.body;
        if (!name.length || !password.length || !email.length ){
            return res.status(400).send ({message:"Please enter the correct format"});
        }
        if (email){
            let checkEmail=validator.isEmail(email);
            if (checkEmail == false){
                return res.status(400).send ({message:"Please enter the correct email format"}) ;
            }
        }
        let result=await User.checkUserEmail(email);
        if (result.length >0){
            return res.status(400).send ({message:"Email already exists"}) ;
        }
        else{
            let hashPwd=await bcrypt.hash(password,8);
            await User.insertUserData(name,email,hashPwd,"native");
            let user=await User.checkUserEmail(email);
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
};

const checkUserToken =async function (req,res){
    try{
        let bearerHeader = req.get("Authorization");
        let bearerToken;
        if (bearerHeader == undefined){
            return res.status(400).json({message:"Pleast signin first"});
        }
        if (bearerHeader){
            bearerToken = bearerHeader.split(" ")[1];
            let verify=await User.verificationToken(bearerToken,JWT_SECRET);
            if (verify == undefined){
                return res.status(400).json({message:"Pleast signin first"});
            }
            else{
                let {id,name}=verify;
                return res.status(200).send({Token:"user is OK , aleard signin",id,name});
            }
        }
        else{
            return res.status(400).json({message:"Pleast signin first"});
        }


    }
    catch(error){
        console.log(error);
        res.status(400).json({message:"Pleast signin first"});
    }
};

const addStandbyRoomAndModeIntoToken=async function(req,res){
    try{
        let {mode} = req.body;
        let roomNum=req.body.room;
        let token = req.get("Authorization").split(" ")[1];
        let payload=await User.verificationToken(token,JWT_SECRET);
        payload.room=roomNum;
        payload.mode=mode;
        let newJWT=await jwt.sign(payload,JWT_SECRET);
        res.status(200).json({message:"success",token:newJWT});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error."});
    }
    
};

const checkUserIdAndNowRoom=async function (req,res){
    try{
        let token = req.get("Authorization").split(" ")[1];
        let payload=await User.verificationToken(token,JWT_SECRET);
        let {id,name,room} = payload;
        res.status(200).json({id,name,room});
    }
    catch(error){
        console.log(error);
        res.status(500).send({error: "Token Error"});
    }
};


const getInformationStartGame=async function (req,res){
    try{
        let token = req.get("Authorization").split(" ")[1];
        let payload=await User.verificationToken(token,JWT_SECRET); 
        let { id ,name,room,player} = payload;
        res.status(200).json({id,name,room,player});
    }
    catch(error){
        res.status(500).send({error: "Token Error"});
    }
};

const checkStandbyRoomModeAndRoom=async function (req,res){
    try{
        let {mode,roomNum} =req.body;
        let check=await User.checkForDuplicate(roomNum);
        if (check == ""){
            res.status(200).json({message:"Confirm entry"});
        }
        else if (check[0].mode == mode){
            res.status(200).json({message:"Confirm entry"});
        }
        else{
            res.status(400).json({message:"This room is a different model"});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error."});
    }
};



const getProfileWinRat=async function (req,res){
    try{
        let id=req.headers.id;
        let score=await User.getScoreWinRat(id);
        
        let buzz=await User.getBuzzWinRat(id);
        let data={score,buzz};
    
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message:"Internal server error."});
    }
};



module.exports={
    signIn,
    signUp,
    checkUserToken,
    addStandbyRoomAndModeIntoToken,
    checkUserIdAndNowRoom,
    getInformationStartGame,
    checkStandbyRoomModeAndRoom,
    getProfileWinRat
};


