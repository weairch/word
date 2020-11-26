//前端game_multe.html的js檔案
// eslint-disable-next-line no-undef
let socket = io();

const user1Form = document.getElementById("user1-form");
const user1Messages=document.querySelector(".user1-messages");

const user2Form = document.getElementById("user2-form");
const user2Messages=document.querySelector(".user2-messages");
// eslint-disable-next-line no-undef
const { username , room } = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

//讓使用者加入房間
socket.emit("joinRoom",{username,room});

//前端接收到一個message事件的時候 會console.log
//並且用下面的outputMessage印在聊天室上面
socket.on("message",function(message){
    console.log(message); 
    user1outputMessage(message);

    //輸入畫面會跟著輸入的字跑
    user1Messages.scrollTop = user1Messages.scrollHeight;
    
});



//當使用者按下submit 禁止他頁面跳轉 並且拿到msg的value
user1Form.addEventListener("submit",function(element){
    element.preventDefault();
    
    //拿到使用者輸入的文字 事件是chatMessage 傳送到後端
    let msg  = element.target.elements.msg.value;
    console.log(msg);
    socket.emit("chatMessage",msg);

    //清空輸入框
    element.target.elements.msg.value="";
    element.target.elements.msg.focus();
});


//下面這個使對話框顯示出來
function user1outputMessage(message){
    let div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector(".user1-messages").appendChild(div);

}











socket.on("message",function(message){
    console.log(message); 
    user2outputMessage(message);

    //輸入畫面會跟著輸入的字跑
    user2Messages.scrollTop = user2Messages.scrollHeight;
    
});

user2Form.addEventListener("submit",function(element){
    element.preventDefault();
    
    //拿到使用者輸入的文字 事件是chatMessage 傳送到後端
    let msg  = element.target.elements.msg.value;
    console.log(msg);
    socket.emit("chatMessage",msg);

    //清空輸入框
    element.target.elements.msg.value="";
    element.target.elements.msg.focus();
});


//下面這個使對話框顯示出來
function user2outputMessage(message){
    let div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector(".user2-messages").appendChild(div);

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
