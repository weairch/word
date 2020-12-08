// eslint-disable-next-line no-undef
const socket = io({
    query: {
        Authorization: localStorage.getItem("Authorization")
    }
});




let localStorageToken = localStorage.getItem("Authorization"); 
let config = {
    method:"POST",
    headers:{
        Authorization:"Bearer "+localStorageToken,
        "Content-Type": "application/json"
    }
};

//fetch api => 得到現在房間跟使用者名稱跟ID
fetch("/api/1.0/userIdAndNowRoom",config)
    .then(function(res){
        return res.json();
    })
    .then(function(user){
        console.log(user);
        let {id , name , room}=user;
        socket.emit("joinRoom",{id,name,room});
    });

socket.on("sessionNumber",function(number){
    let data={number,Authorization:localStorageToken};
    console.log(number);
    socket.emit("readyStart",data);
});

socket.on("playerReady",function(){
    location.href="/contest/game/multe";
});

socket.on("timeOut",function(message){
    alert(message);
    setTimeout(function(){
        //這裡有BUG 只有一個人會alert 2個message 另外一個會直接跳回指定網頁
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


// eslint-disable-next-line no-unused-vars
function ready(){
    socket.emit("ready","ready");
}

// eslint-disable-next-line no-unused-vars
function unReady(){
    socket.emit("unReady","unready");
}



document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
});