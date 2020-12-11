// eslint-disable-next-line no-undef
const socket = io({
    query: {
        Authorization: localStorage.getItem("Authorization")
    }
});




let localStorageToken = localStorage.getItem("Authorization"); 
// let config = {
//     method:"POST",
//     headers:{
//         Authorization:"Bearer "+localStorageToken,
//         "Content-Type": "application/json"
//     }
// };

//fetch api => 得到現在房間跟使用者名稱跟ID
// fetch("/api/1.0/userIdAndNowRoom",config)
//     .then(function(res){
//         return res.json();
//     })
//     .then(function(user){
//         console.log(user);
//         let {id , name , room}=user;
//         socket.emit("joinRoom",{id,name,room});
//     });

socket.on("sessionNumber",function(number){
    let { mode ,randomNumber }=number;
    let data={mode,number:randomNumber,Authorization:localStorageToken};
    socket.emit("readyStart",data);
});

socket.on("scorePlayerReady",function(){
    location.href="/contest/game/multe";
});

socket.on("buzzPlayerReady",function(session){
    localStorage.setItem("session",JSON.stringify(session));
    location.href="/contest/game/Buzz";
});

socket.on("timeOut",function(message){
    alert(message);
    setTimeout(function(){
        location.href="/contest/multi";
    },3000);
});


socket.on("token",function(token){
    console.log(token);
    // localStorage.setItem("Authorization",token);
});


socket.on("toMany",function(message){
    alert(message);
    location.href="/contest/multi";
});

//限制只能點擊一次
let count=0;
// eslint-disable-next-line no-unused-vars
function ready(){
    if (count<1){
        count++;
        console.log(count);
        socket.emit("ready","ready");
    }

}

// eslint-disable-next-line no-unused-vars
function unReady(){
    socket.emit("unReady","unready");
}



document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
});

// socket.on("randomTopic",function(message){
//     console.log(message);
// })