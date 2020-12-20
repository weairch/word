// eslint-disable-next-line no-undef
const socket = io({
    query: {
        Authorization: localStorage.getItem("Authorization")
    }
});


let localStorageToken = localStorage.getItem("Authorization"); 


socket.emit("addStandbyRoomToSQL",localStorageToken);
setTimeout(function(){
    socket.emit("tellEveryoneAboutTheRoom","roomNow");
},500);

const userInformation=async function (){
    let config = {
        method:"POST",
        headers:{
            Authorization:"Bearer "+localStorageToken,
            "Content-Type": "application/json"
        }
    };
    // fetch api => 得到現在房間跟使用者名稱跟ID
    let res=await fetch("/api/1.0/userIdAndNowRoom",config);
    let user=await res.json();
    let {id , name , room}=user;
    socket.emit("joinRoom",{id,name,room});
    return user;
};


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



socket.on("toMany",function(message){
    alert(message);
    location.href="/contest/multi";
});



userInformation().then(async function (user){
    let { name,room }=user;
    socket.emit("joinRoomMessage","welcome");


    document.getElementById("btn").addEventListener("click",function(){
        let message=document.getElementById("input").value;
        document.getElementById("input").value="";
        let data={name,room,message};
        socket.emit("sendMessage",data);
    });
});



const topBox=document.getElementById("topBox");
socket.on("selfInput",function(res){
    console.log("這裡是我拿到我自己的"+res);
    let {name,time,message}=res;

    //最上層容器
    let father=document.getElementById("father");

    //第二層(都要綁在它上面)
    let nodeDiv=document.createElement("div");
    nodeDiv.classList.add("d-flex");
    nodeDiv.classList.add("justify-content-start");
    nodeDiv.classList.add("mb-4");
    
    //名字
    let imagDiv=document.createElement("div");
    imagDiv.classList.add("img_cont_msg");

    let imagName=document.createElement("div");
    imagName.classList.add("rounded-circle");
    imagName.innerHTML=name;
    imagDiv.appendChild(imagName);
    
    //訊息
    let msgDiv=document.createElement("div");
    msgDiv.classList.add("msg_cotainer");
    msgDiv.innerHTML=message;
    
    //時間
    let timeSpan=document.createElement("span");
    timeSpan.classList.add("msg_time");
    timeSpan.innerHTML=time;
    msgDiv.appendChild(timeSpan);

    //最後appendChild
    nodeDiv.appendChild(imagDiv);
    nodeDiv.appendChild(msgDiv);
    father.appendChild(nodeDiv);

    topBox.scrollTop=topBox.scrollHeight;
});


socket.on("ortherMessage",function(res){
    console.log("這裡是別人傳給我的"+res);

    let {name,time,message}=res;

    //最上層容器
    let father=document.getElementById("father");

    //第二層容器 都綁在它上面
    let nodeDiv=document.createElement("div");
    nodeDiv.classList.add("d-flex");
    nodeDiv.classList.add("justify-content-end");
    nodeDiv.classList.add("mb-4");

    //訊息
    let otherMessage=document.createElement("div");
    otherMessage.classList.add("msg_cotainer_send");
    otherMessage.innerHTML=message;
    
    //時間
    let timeSpan=document.createElement("span");
    timeSpan.classList.add("msg_time_send");
    timeSpan.innerHTML=time;
    otherMessage.appendChild(timeSpan);
    
    let div=document.createElement("div");
    div.classList.add("img_cont_msg");
    let nameDiv=document.createElement("div");
    nameDiv.innerHTML=name;
    nameDiv.classList.add("rounded-circle");
    div.appendChild(nameDiv);
    
    nodeDiv.appendChild(otherMessage);
    nodeDiv.appendChild(div);
    father.appendChild(nodeDiv);


    topBox.scrollTop=topBox.scrollHeight;
});



socket.on("joinRoomWelcomeMessage",function(res){
    let { name,time }=res;
    console.log(name,time);
    let message ="Welcome Player: "+name+" join room";
    let father=document.getElementById("father");

    let nodeDiv=document.createElement("div");
    nodeDiv.classList.add("d-flex");
    nodeDiv.classList.add("justify-content-center");
    nodeDiv.classList.add("mb-4");

    let otherMessage=document.createElement("div");
    otherMessage.classList.add("msg_cotainer_send");
    otherMessage.innerHTML=message;
    
    nodeDiv.appendChild(otherMessage);
    father.appendChild(nodeDiv);

    topBox.scrollTop=topBox.scrollHeight;
});


socket.on("leaveRoomMessage",function(res){
    let { name,time }=res;
    console.log(name,time);
    let message ="Player: "+name+" leave room";
    let father=document.getElementById("father");

    let nodeDiv=document.createElement("div");
    nodeDiv.classList.add("d-flex");
    nodeDiv.classList.add("justify-content-center");
    nodeDiv.classList.add("mb-4");

    let otherMessage=document.createElement("div");
    otherMessage.classList.add("msg_cotainer_send");
    otherMessage.innerHTML=message;
    
    nodeDiv.appendChild(otherMessage);
    father.appendChild(nodeDiv);

    topBox.scrollTop=topBox.scrollHeight;
});

socket.on("userReadyMessage",function(res){
    let { name,time }=res;
    console.log(name,time);
    let message ="Player: "+name+" is ready";
    let father=document.getElementById("father");

    let nodeDiv=document.createElement("div");
    nodeDiv.classList.add("d-flex");
    nodeDiv.classList.add("justify-content-center");
    nodeDiv.classList.add("mb-4");

    let otherMessage=document.createElement("div");
    otherMessage.classList.add("msg_cotainer_send");
    otherMessage.innerHTML=message;
    
    nodeDiv.appendChild(otherMessage);
    father.appendChild(nodeDiv);

    topBox.scrollTop=topBox.scrollHeight;
});

socket.on("userUnreadyMessage",function(res){
    let { name,time }=res;
    console.log(name,time);
    let message ="Player: "+name+" is waitting";
    let father=document.getElementById("father");

    let nodeDiv=document.createElement("div");
    nodeDiv.classList.add("d-flex");
    nodeDiv.classList.add("justify-content-center");
    nodeDiv.classList.add("mb-4");

    let otherMessage=document.createElement("div");
    otherMessage.classList.add("msg_cotainer_send");
    otherMessage.innerHTML=message;
    
    nodeDiv.appendChild(otherMessage);
    father.appendChild(nodeDiv);

    topBox.scrollTop=topBox.scrollHeight;
});



//限制只能點擊一次
let count=true;
// eslint-disable-next-line no-unused-vars
function ready(){
    if (count){
        count=false;
        socket.emit("ready","ready");
    }
}
// eslint-disable-next-line no-unused-vars
function unReady(){
    if (!count){
        count=true;
        socket.emit("unReady","unready");
    }

}



document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
});

