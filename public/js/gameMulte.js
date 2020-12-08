// eslint-disable-next-line no-undef
const socket = io({
    query: {
        Authorization: localStorage.getItem("Authorization")
    }
});


let localStorageToken = localStorage.getItem("Authorization");


let config2 = {
    method:"POST",
    headers:{
        Authorization:"Bearer "+localStorageToken,
        "Content-Type": "application/json"
    }
};
fetch("/api/1.0/checkUserToken",config2)
    .then(function (res){
        return res.json();
    })
    .then(function(result){
        if (result.Token == undefined){
            alert(result.message);
            location.href="/admin/signin";
        }
    })
    .catch(function(err){
        console.log(err);
    });



let config = {
    method: "GET",
    headers: {
        Authorization: "Bearer " + localStorageToken,
        "Content-Type": "application/json"
    }
};

socket.emit("addSocketIdToData", localStorageToken);

//拿取所需要的資訊
const Information= async function () {
    let res1 = await fetch("/api/1.0/needInformationStartGame",config);
    let user = await res1.json();
    console.log(user);
    let res2 = await fetch("/api/1.0/function/randomWord",config);
    let topic = await res2.json();
    console.log(topic);
    let session ={
        method:"GET",
        headers:{
            Authorization:"Bearer "+localStorageToken,
            "Content-Type": "application/json",
            uid:user.id
        }
    };
    let res3 = await fetch("/api/1.0/function/sessionNumber",session);
    let sessionNumber = await res3.json();
    return {user, topic, sessionNumber};
};


//動態生成js
Information().then(function(res){

    let { sessionNumber } = res;
    let { english,chinese } = res.topic;
    let { id,name,room  } = res.user;


    socket.on("event",function(){
        let number = document.querySelector(".otherScoreNumber");
        number.innerHTML++;

    });

    //countdown timer 下面設定秒數
    const currentTime = Date.parse(new Date());
    const deadline=new Date(currentTime +   30  *1000);
    initializeClock("clockdiv", deadline,sessionNumber,id);




    //Create english topic
    let englishTopicOutput = document.getElementById("topicEnglisg");
    let englishDiv = document.createElement("div");
    englishDiv.classList.add("topic");
    englishDiv.innerHTML=english;
    englishTopicOutput.appendChild(englishDiv);




    //Create self score 
    let score = document.getElementById("score");
    let scoreDiv=document.createElement("div");
    scoreDiv.classList.add("scoreNumber");
    scoreDiv.innerHTML=0;
    score.appendChild(scoreDiv);


    //Create other score
    let ortherScore = document.getElementById("otherScore");
    let ortherScoreDiv=document.createElement("div");
    ortherScoreDiv.classList.add("otherScoreNumber");
    ortherScoreDiv.innerHTML=0;
    ortherScore.appendChild(ortherScoreDiv);



    //Create option  
    for (let i=0;chinese.length>i;i++){
        let  div =document.getElementById("option");
        let  btn =document.createElement("button");
        btn.classList.add("btn"+i);          
        btn.innerHTML =chinese[i];
        div.appendChild(btn);
        document.querySelector(".btn"+i).addEventListener("click",function(){
            answer(i,sessionNumber,english,id,name,room);    
        });
    }
});



//click function
async function answer(i,sessionNumber,english,id,name,room){
    let option=document.querySelector(".btn"+i).textContent;
    let data={sessionNumber,english,id,name,option,room};
    let config={
        method:"POST",
        headers:{
            Authorization:"Bearer "+localStorageToken,
            "Content-Type": "application/json",
        },
        body:JSON.stringify(data)
    };
    let res = await fetch("/api/1.0/function/confirmAnswer",config);
    let check = await res.json();


    if (check.message == "correct"){

        //通知房間其他人
        socket.emit("otherSessionCorrect","correct");


        alert("恭喜答對");
        
        
        document.querySelector(".scoreNumber").innerHTML++;
        
        
        let res = await fetch("/api/1.0/function/randomWord");
        let topic = await res.json();
        let { english,chinese } = topic;
        console.log(english,chinese);
        document.querySelector(".topic").innerHTML=english;
        let  div =document.getElementById("option");
        div.innerHTML="";
        for (let i=0;chinese.length>i;i++){
            let  div =document.getElementById("option");
            let  btn =document.createElement("button");
            btn.classList.add("btn"+i);          
            btn.innerHTML =chinese[i];
            div.appendChild(btn);
            document.querySelector(".btn"+i).addEventListener("click",function(){
                answer(i,sessionNumber,english,id,name);    
            });
        }
    }


    else if (check.message == "error"){

        alert("答錯囉");
        let res = await fetch("/api/1.0/function/randomWord");
        let topic = await res.json();
        let { english,chinese } = topic;
        console.log(english,chinese);
        document.querySelector(".topic").innerHTML=english;
        let  div =document.getElementById("option");
        div.innerHTML="";
        for (let i=0;chinese.length>i;i++){
            let  div =document.getElementById("option");
            let  btn =document.createElement("button");
            btn.classList.add("btn"+i);          
            btn.innerHTML =chinese[i];
            div.appendChild(btn);
            document.querySelector(".btn"+i).addEventListener("click",function(){
                answer(i,sessionNumber,english,id,name);    
            });
        }
    }
}



//=============   clock function   ==============
function getTimeRemaining(endtime){
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor( (total/1000) % 60 );
    return {
        total,
        seconds
    };
}

function initializeClock(id, endtime,Session,uid) {
    const clock = document.getElementById(id);
    const timeinterval = setInterval(() => {
        const t = getTimeRemaining(endtime);
        clock.innerHTML = "seconds:" + t.seconds;
        if (t.total <= 0) {
            clearInterval(timeinterval);

            let data = {Session,uid};
            let config ={
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(data)
            };
            fetch("/api/1.0/function/lostOrWin",config)
                .then(function(res){
                    return res.json();
                })
                .then(function(result){
                    alert(result.message);
                    location.href="/contest/multi";
                });
        }
    },1000);
}




// fetch("/api/1.0/needInformationStartGame",config)
//     .then(function (res){
//         return res.json();
//     })
//     .then(function(result){
//         let { id,name,player,room } = result;
//         socket.emit("gameRoom",{id,name,player,room});
//         return result;
//     })
//     .then(async function(result){
//         const topic=await fetch("/api/1.0/function/randomWord",config)
//             .then(function(res){
//                 return res.json();
//             })
//             .then(function(result){
//                 return result;
//             });
//         return [result,topic];


//     })
//     .then(async function(result){
//         config={
//             method:"GET",
//             headers:{
//                 Authorization:"Bearer "+localStorageToken,
//                 "Content-Type": "application/json",
//                 uid:result[0].id
//             }
//         };
//         const session = await fetch("/api/1.0/function/sessionNumber",config)
//             .then(function(res){
//                 return res.json();
//             })
//             .then(function(result){
//                 return (result);
//             });
//         return [session,result];
//     })
//     .then(async function(result){
//         console.log(result);
//         let sessionNumber=result[0];
//         let { id,name,room }=result[1][0];
//         let { english }= result[1][1];

//         let englishTopicOutput = document.getElementById("topicEnglisg");
//         let englishDiv = document.createElement("div");
//         englishDiv.innerHTML=english;
//         englishTopicOutput.appendChild(englishDiv);

//         let chinese=result[1][1].chinese;
//         for (let i=0;chinese.length>i;i++){
//             let  div =document.getElementById("option");
//             let  btn =document.createElement("button");          
//             btn.innerHTML =chinese[i];
//             div.appendChild(btn);

//             let data = {chinese[i],id,name,sessionNumber}

//             btn.onclick =async function () {       
//                 let config ={
//                     method:"POST",
//                     headers:{
//                         "Content-Type": "application/json",
//                     },
//                     body:JSON.stringify(data)
//                 };
//                 let check=await fetch("/api/1.0/function/confirmAnswer",config);
//                 console.log(check);
//             };
//         }
//     })
//     .catch(function(err){
//         console.log(err);
//     });



// fetch("/api/1.0/function/randomWord",config)
//     .then(function(res){
//         return res.json();
//     })
//     .then(function(topic){

//         //====題目====
//         let englishTopic=topic.english;
//         let englishTopicOutput = document.getElementById("topicEnglisg");
//         let englishDiv = document.createElement("div");
//         englishDiv.innerHTML=englishTopic;
//         englishTopicOutput.appendChild(englishDiv);


//         //====動態生成btton====

//         let chineseTopicArray = topic.chinese;
//         for (let i =0 ;chineseTopicArray.length>i;i++){
//             console.log(chineseTopicArray[i]);
//             let  div =document.getElementById("option");
//             let  btn =document.createElement("button");           //createElement生成button对象
//             btn.innerHTML =chineseTopicArray[i];
//             div.appendChild(btn);
//             btn         
//         }

//         // bt.onclick = function () {                          //绑定点击事件
//         //     delete(this.parentNode.parentNode.id);
//         // };

//     });


















// const user1Messages=document.querySelector(".user1-messages");
// const user2Messages=document.querySelector(".user2-messages");

// socket.on("user1Message",function(message){
//     user1outputMessage(message);
//     //輸入畫面會跟著輸入的字跑
//     user1Messages.scrollTop = user1Messages.scrollHeight;
//     console.log(message);
// });
// socket.on("user2Message",function(message){
//     user2outputMessage(message);
//     user2Messages.scrollTop = user2Messages.scrollHeight;
//     console.log(message);
// });

// socket.on("StartMessage",function(message){
//     user2outputMessage(message);
//     user1outputMessage(message);
// });

// socket.on("GameTopic",function(topic){
//     let Topic = topic.data.english;
//     let topicType = topic.data.type;
//     let timeOut = topic.data.timeOut;
//     let topicNumber = topic.data.topicNumber;
//     console.log(topic);
//     innerHTMLtopic(Topic,topicType,topicNumber);
//     const deadline = new Date(Date.parse(new Date()) + timeOut * 1000); 
//     initializeClock("clockdiv", deadline);
// });


// //以下都是功能function
// //<=================================================================================>

// //下面這個使對話框顯示出來
// function user1outputMessage(message){
//     let div = document.createElement("div");
//     div.classList.add("message");
//     div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
//     <p class="text">${message.text}</p>`;
//     document.querySelector(".user1-messages").appendChild(div);

// }
// function user2outputMessage(message){
//     let div = document.createElement("div");
//     div.classList.add("message");
//     div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
//     <p class="text">${message.text}</p>`;
//     document.querySelector(".user2-messages").appendChild(div);

// }

// function addListener(userid,name){
//     setTimeout(function(){
//         let list = document.querySelectorAll(".form");

//         for (let i=0 ; list.length>i ; i++){
//             list[i].addEventListener("submit",function(element){
//                 element.preventDefault();
//                 let msg  =element.target.elements.msg.value;
//                 socket.emit(`user${i+1}FightMessage`,msg);

//                 // let user={username,msg};
//                 let user={userid,name,msg};
//                 //這裡傳出battleMessage
//                 socket.emit("battleMessage",user);

//                 element.target.elements.msg.value="";
//                 element.target.elements.msg.focus();
//             });
//         }
//     },1000);

// };



// //把題目放到網頁裡面
// function innerHTMLtopic(topic,type,number){
//     let div = document.querySelector(".topicPosition");
//     let topicNumber = document.querySelector(".topicNumber");
//     div.innerHTML="";
//     div.innerHTML=`<p>題目 : ${topic} </p><p>型態 : ${type}</p>`;
//     topicNumber.innerHTML="";
//     topicNumber.innerHTML="題數: "+number;
// }



// //這裡是知道時間的range
// function getTimeRemaining(endtime) { 
//     const total = Date.parse(endtime) - Date.parse(new Date()); 
//     const seconds = Math.floor((total / 1000) % 60); 

//     return { 
//         total, 
//         seconds 
//     }; 
// } 

// //初始化時間
// function initializeClock(id, endtime) { 
//     const clock = document.getElementById(id); 
//     const secondsSpan = clock.querySelector(".seconds"); 

//     function updateClock() { 
//         const t = getTimeRemaining(endtime); 
//         secondsSpan.innerHTML = ("0" + t.seconds).slice(-2); 

//         if (t.total <= 0) { 
//             clearInterval(timeinterval); 
//         } 
//     } 

//     updateClock(); 
//     const timeinterval = setInterval(updateClock, 1000); 
// } 



