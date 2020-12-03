/* eslint-disable linebreak-style */
require("dotenv").config();
const { PORT , API_VERSION} = process.env;
const express = require("express");
const app = express();


const bodyparser = require("body-parser");
const cors = require("cors");


app.use(express.static("public"));
app.use("/contest",express.static("public")); //這樣game_multe.js才吃的到
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));


app.use(cors());

//api routs
app.use("/api/"+API_VERSION,
    [
        require("./server/routes/function_route"),    
        require("./server/routes/user_route")    
    ]
);


//socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { socketCon } = require("./util/socketcon");
socketCon(io);




//HTML routs
app.get("/",function(req,res){
    res.sendFile(__dirname+"/public/views/index.html");
});

app.get("/admin/signin",function(req,res){
    res.sendFile(__dirname+"/public/views/signin.html");
});

app.get("/contest/single",function(req,res){
    res.sendFile(__dirname+"/public/views/single.html"); 
});

app.get("/contest/multi",function(req,res){
    res.sendFile(__dirname+"/public/views/game_room.html");
});

app.get("/contest/standby",function(req,res){
    res.sendFile(__dirname+"/public/views/game_standby.html");
});

app.get("/function/history",function(req,res){
    res.sendFile(__dirname+"/public/views/history.html");
});

app.get("/function/history/detailed",function(req,res){
    res.sendFile(__dirname+"/public/views/history_detailed.html");
});

app.get("/contest/game/multe",function(req,res){
    res.sendFile(__dirname+"/public/views/game_multe.html");
});




// Error handling
// app.use(function(err, req, res, ) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
// });

server.listen(PORT,function(){
    console.log("listening on port "+PORT);
});

module.exports =app;