require("dotenv").config();
const { checkUser,insertUserData ,verificationToken ,userInStandbyRoom} = require("../models/userModels");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function signIn(req,res){
    let {name , password , email } = req.body;
    if (!name.length || !password.length || !email.length ){
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


function signUp(req,res){
    let {name,password,email} = req.body;
    if (!name.length || !password.length || !email.length ){
        return res.status(500).send ({message:"Please enter the correct format"});
    }
    checkUser(email)
        .then(function(result){
            if (result.length > 0){
                return Promise.reject();
            }
            else {
                return bcrypt.hash(password,8);
            }
        })
        .then(function(hashPwd){
            return insertUserData(name,email,hashPwd,"native");
        })
        .then(function(){
            res.status(200).send({message:"signUp success"});
        })
        .catch(function(){
            res.status(500).send ({message:"Email already exists"}) ;
        });

}

function checkUserToken (req,res){
    let bearerHeader = req.get("Authorization");
    let bearerToken = bearerHeader.split(" ")[1];
    if (bearerToken !== "null"){
        verificationToken(bearerToken,JWT_SECRET)
            .then(function(){
                res.send({Token:"user is OK , aleard signin"});
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
    let roomNum=req.headers.room;
    let token = req.get("Authorization").split(" ")[1];
    verificationToken(token,JWT_SECRET)
        .then(function(payload){
            userInStandbyRoom(payload.id,roomNum);
            return payload;
        })
        .then(function(payload){
            payload.room=roomNum;
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
            // res.json({payload});
        });
}

function addTokenPlayer_2(req,res){
    let token = req.get("Authorization").split(" ")[1]; 
    verificationToken(token,JWT_SECRET)
        .then(function(payload){
            payload.player="player2";
            let newJWT=jwt.sign(payload,JWT_SECRET);
            res.json(newJWT);
        });
}

function changeTokenToPlayer_1(req,res){
    let token = req.get("Authorization").split(" ")[1]; 
    verificationToken(token,JWT_SECRET)
        .then(function(payload){
            payload.player="player1";
            let newJWT=jwt.sign(payload,JWT_SECRET);
            res.json(newJWT);
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

module.exports={
    signIn,
    signUp,
    checkUserToken,
    sqlAddStandbyRoom,
    userIdAndNowRoom,
    addTokenPlayer_2,
    changeTokenToPlayer_1,
    needInformationStartGame
};




