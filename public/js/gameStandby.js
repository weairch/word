/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
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
    let res=await fetch("/api/1.0/checkUserIdAndNowRoom",config);
    let user=await res.json();
    let {id , name , room}=user;
    socket.emit("joinRoom",{id,name,room});
    socket.emit("checkStandbyRoom",room);
    return user;
};


socket.on("sessionNumber",function(number){
    let { mode ,randomNumber }=number;
    let data={mode,number:randomNumber,Authorization:localStorageToken};
    socket.emit("readyStart",data);
});

socket.on("scorePlayerReady",function(){
    location.href="/contest/game/multi";
});

socket.on("buzzPlayerReady",function(session){
    localStorage.setItem("session",JSON.stringify(session));
    location.href="/contest/game/Buzz";
});



socket.on("toMany",function(message){
    Swal.fire(message,{
        buttons:{
            OK:true,
        },
    })
        .then(()=>{
            location.href="/contest/multi";
        });
});


userInformation().then(async function (user){
    let { name,room }=user;
    socket.emit("joinRoomMessage","welcome");
    socket.emit("roomUser",room);
 


    document.getElementById("btn").addEventListener("click",function(){
        let message=document.getElementById("input").value;
        if (message == ""){
            return;
        }
        else {
            document.getElementById("input").value="";
            let data={name,room,message};
            socket.emit("sendMessage",data);
        }
    });

    document.getElementById("input").addEventListener("keyup",function(event){
        let message=document.getElementById("input").value;
        if (message =="\n"){
            return;
        }
        else if (event.keyCode === 13 ){
            document.getElementById("input").value="";
            let data={name,room,message};
            socket.emit("sendMessage",data);
        }
        

    });
});

socket.on("userList",function(list){
    let topUserBox=document.querySelector(".user");
    topUserBox.innerHTML="";

    for (let i=0;list.length>i;i++){
        let userName=list[i];
        let userDiv=document.createElement("div");
        userDiv.innerHTML=userName;
        topUserBox.appendChild(userDiv);
    }
});



const topBox=document.getElementById("topBox");
socket.on("selfInput",function(res){
    let {name,time,message}=res;

    //Top container 
    let father=document.getElementById("father");

    //second,Tied to it
    let nodeDiv=document.createElement("div");
    nodeDiv.classList.add("d-flex");
    nodeDiv.classList.add("justify-content-start");
    nodeDiv.classList.add("mb-4");
    

    let imagDiv=document.createElement("div");
    imagDiv.classList.add("img_cont_msg");

    let imagName=document.createElement("div");
    imagName.classList.add("rounded-circle");
    imagName.innerHTML=name;
    imagDiv.appendChild(imagName);

    //Message
    let msgDiv=document.createElement("div");
    msgDiv.classList.add("msg_cotainer");
    msgDiv.innerHTML=message;
    
    //time
    let timeSpan=document.createElement("span");
    timeSpan.classList.add("msg_time");
    timeSpan.innerHTML=time;
    msgDiv.appendChild(timeSpan);


    nodeDiv.appendChild(imagDiv);
    nodeDiv.appendChild(msgDiv);
    father.appendChild(nodeDiv);

    topBox.scrollTop=topBox.scrollHeight;
});


socket.on("ortherMessage",function(res){

    let {name,time,message}=res;

    //Top container 
    let father=document.getElementById("father");

    //second,Tied to it
    let nodeDiv=document.createElement("div");
    nodeDiv.classList.add("d-flex");
    nodeDiv.classList.add("justify-content-end");
    nodeDiv.classList.add("mb-4");

    //Message
    let otherMessage=document.createElement("div");
    otherMessage.classList.add("msg_cotainer_send");
    otherMessage.innerHTML=message;
    
    //time
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

    let message ="Welcome Player: "+name+" joins room";
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



//limit one click
let count=true;
// eslint-disable-next-line no-unused-vars
function ready(){
    if (count){
        count=false;
        document.getElementById("ready").innerHTML="Cancel";
        socket.emit("ready","ready");
    }
    else if (!count){
        count=true;
        document.getElementById("ready").innerHTML="Ready";
        socket.emit("unReady","unready");
    }
}



function back(){
    window.location.href="/contest/multi";
}



document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
});

