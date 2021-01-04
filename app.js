/* eslint-disable linebreak-style */
require("dotenv").config();
const { PORT , API_VERSION}=process.env;
const express=require("express");
const app=express();


const bodyparser=require("body-parser");
const cors=require("cors");


app.use(express.static("public"));
app.use("/contest",express.static("public")); 
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));


app.use(cors());

//api routs
app.use("/api/"+API_VERSION,
    [
        require("./server/routes/rankingRoute"),
        require("./server/routes/gameRoute"),    
        require("./server/routes/userRoute")    
    ]
);


//socket.io
const server=require("http").createServer(app);
const io=require("socket.io")(server);
const { socketCon }=require("./server/socket/socketConnect");
socketCon(io);




//HTML routs
app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/views/index.html");
});
app.get("/user/profile",function(req,res){
    res.sendFile(__dirname+"/public/views/profile.html");
});
app.get("/user/signin",function(req,res){
    res.sendFile(__dirname+"/public/views/signin.html");
});

app.get("/user/signup",function(req,res){
    res.sendFile(__dirname+"/public/views/signup.html");
});

app.get("/contest/single",function(req,res){
    res.sendFile(__dirname+"/public/views/gameSingle.html"); 
});

app.get("/contest/multi",function(req,res){
    res.sendFile(__dirname+"/public/views/gameRoom.html");
});

app.get("/contest/standby",function(req,res){
    res.sendFile(__dirname+"/public/views/gameStandby.html");
});

app.get("/function/ranking",function(req,res){
    res.sendFile(__dirname+"/public/views/ranking.html");
});

app.get("/contest/game/multi",function(req,res){
    res.sendFile(__dirname+"/public/views/gameMulti.html");
});

app.get("/contest/game/Buzz",function(req,res){
    res.sendFile(__dirname+"/public/views/gameBuzz.html");
});


server.listen(PORT,function(){
    console.log("listening on port "+PORT);
});

module.exports=app;