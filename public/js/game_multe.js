//前端game_multe.html的js檔案
// eslint-disable-next-line no-undef
let socket = io();



// eslint-disable-next-line no-undef
const { username , room } = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

//讓使用者加入房間
socket.emit("joinRoom",{username,room});

//前端接收到一個message事件的時候 會console.log
//並且用下面的outputMessage印在聊天室上面
socket.on("user1Message",function(message){
    user1outputMessage(message);
    //輸入畫面會跟著輸入的字跑
    user1Messages.scrollTop = user1Messages.scrollHeight;
    
});


const user1Messages=document.querySelector(".user1-messages");

//下面這個使對話框顯示出來
function user1outputMessage(message){
    let div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector(".user1-messages").appendChild(div);

}

//<=============================================================>

const user2Messages=document.querySelector(".user2-messages");

socket.on("user2Message",function(message){
    user2outputMessage(message);

    //輸入畫面會跟著輸入的字跑
    user2Messages.scrollTop = user2Messages.scrollHeight;
    
});

function user2outputMessage(message){
    let div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector(".user2-messages").appendChild(div);

}

window.onload=function(){
    let list = document.querySelectorAll(".form");

    for (let i=0 ; list.length>i ; i++){
        list[i].addEventListener("submit",function(element){
            element.preventDefault();
            let msg  = element.target.elements.msg.value;
            socket.emit(`user${i+1}FightMessage`,msg);
            let user={username,msg};
            socket.emit("battleMessage",user);
            element.target.elements.msg.value="";
            element.target.elements.msg.focus();
        });
    }
};



let url = "http://"+location.hostname+":"+location.port+"/api/1.0/function/randomWord";

fetch(url).then(function(res){
    return res.json();
}).then(function(result){
    return result.data;
}).then(function(data){
    topic(data);    
    socket.emit("userTopic",data);
}).catch(function(err){
    console.log(err);
});

function topic(data){
    let englishTopic=data.english;
    let englishType =data.type;
    let div = document.createElement("div");
    div.classList.add("topic");
    div.innerHTML=`<p>題目 : ${englishTopic} </p><p>型態 : ${englishType}</p>`;
    document.querySelector(".topicPosition").appendChild(div);
}


//<================================================================================================

//前端
// eslint-disable-next-line no-undef
// let socket = io();
// let fightForm = document.querySelector(".userFight");
// const { username , room } = Qs.parse(location.search,{
//     ignoreQueryPrefix:true
// });
// socket.emit("userName",username);



// fightForm.addEventListener("submit",function(element){
//     element.preventDefault();
//     //拿到使用者輸入的文字 事件是chatMessage 傳送到後端
//     let msg  = element.target.elements.msg.value;
//     socket.emit("Message",msg);

//     //輸出訊息
//     outputMessage(msg);

//     //清空輸入框
//     element.target.elements.msg.value="";
    
// });

// function outputMessage(message){
//     let div = document.createElement("div");
//     div.classList.add("message");
//     div.innerHTML=`<p class="meta">${username}<span>time</span></p>
//     <p class="text">說:${message}</p>`;
//     document.querySelector(".userTalk").appendChild(div);
// }
// //接收somemessage
// socket.on("somemessage",function(message){
//     console.log(message); 
//     //印出message
//     joinMessage(message);

//     //輸入畫面會跟著輸入的字跑
//     // chatMessages.scrollTop = chatMessages.scrollHeight;
    
// });



// function joinMessage(message){
//     let div = document.createElement("div");
//     div.classList.add("joinLeftmessage");
//     div.innerHTML=`<p class="meta">${username},`+message;
//     document.querySelector(".userTalk").appendChild(div);
// }
