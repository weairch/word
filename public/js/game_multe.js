// eslint-disable-next-line no-undef
const socket = io({
    query: {
        Authorization: localStorage.getItem("Authorization")
    }
});






let localStorageToken = localStorage.getItem("Authorization"); 
let config = {
    method:"GET",
    headers:{
        Authorization:"Bearer "+localStorageToken,
        "Content-Type": "application/json"
    }
};
fetch("/api/1.0/needInformationStartGame",config)
    .then(function (res){
        return res.json();
    })
    .then(function(result){
        let { id,name,player,room } = result;
        socket.emit("gameRoom",{id,name,player,room});

        addListener({id,name});

        return result;
    })
    .catch(function(err){
        console.log(err);
    });
socket.emit("addSocketIdToData",localStorageToken);



socket.on("topic",function(message){
    console.log(message);
});









const user1Messages=document.querySelector(".user1-messages");
const user2Messages=document.querySelector(".user2-messages");

socket.on("user1Message",function(message){
    user1outputMessage(message);
    //輸入畫面會跟著輸入的字跑
    user1Messages.scrollTop = user1Messages.scrollHeight;
    console.log(message);
});
socket.on("user2Message",function(message){
    user2outputMessage(message);
    user2Messages.scrollTop = user2Messages.scrollHeight;
    console.log(message);
});

socket.on("StartMessage",function(message){
    user2outputMessage(message);
    user1outputMessage(message);
});

socket.on("GameTopic",function(topic){
    let Topic = topic.data.english;
    let topicType = topic.data.type;
    let timeOut = topic.data.timeOut;
    let topicNumber = topic.data.topicNumber;
    console.log(topic);
    innerHTMLtopic(Topic,topicType,topicNumber);
    const deadline = new Date(Date.parse(new Date()) + timeOut * 1000); 
    initializeClock("clockdiv", deadline);
});


//以下都是功能function
//<=================================================================================>

//下面這個使對話框顯示出來
function user1outputMessage(message){
    let div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector(".user1-messages").appendChild(div);

}
function user2outputMessage(message){
    let div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector(".user2-messages").appendChild(div);

}

function addListener(userid,name){
    setTimeout(function(){
        let list = document.querySelectorAll(".form");
    
        for (let i=0 ; list.length>i ; i++){
            list[i].addEventListener("submit",function(element){
                element.preventDefault();
                let msg  =element.target.elements.msg.value;
                socket.emit(`user${i+1}FightMessage`,msg);
    
                // let user={username,msg};
                let user={userid,name,msg};
                //這裡傳出battleMessage
                socket.emit("battleMessage",user);
    
                element.target.elements.msg.value="";
                element.target.elements.msg.focus();
            });
        }
    },1000);

};



//把題目放到網頁裡面
function innerHTMLtopic(topic,type,number){
    let div = document.querySelector(".topicPosition");
    let topicNumber = document.querySelector(".topicNumber");
    div.innerHTML="";
    div.innerHTML=`<p>題目 : ${topic} </p><p>型態 : ${type}</p>`;
    topicNumber.innerHTML="";
    topicNumber.innerHTML="題數: "+number;
}



//這裡是知道時間的range
function getTimeRemaining(endtime) { 
    const total = Date.parse(endtime) - Date.parse(new Date()); 
    const seconds = Math.floor((total / 1000) % 60); 
    
    return { 
        total, 
        seconds 
    }; 
} 
   
//初始化時間
function initializeClock(id, endtime) { 
    const clock = document.getElementById(id); 
    const secondsSpan = clock.querySelector(".seconds"); 
   
    function updateClock() { 
        const t = getTimeRemaining(endtime); 
        secondsSpan.innerHTML = ("0" + t.seconds).slice(-2); 
   
        if (t.total <= 0) { 
            clearInterval(timeinterval); 
        } 
    } 
   
    updateClock(); 
    const timeinterval = setInterval(updateClock, 1000); 
} 
   



function random(min,max){
    let choices = max - min + 1;
    let num = Math.floor(Math.random() * choices + min );
    return num;
}
