// eslint-disable-next-line no-undef
/* eslint-disable no-undef */
/* eslint-disable indent */
const socket = io({
    query: {
        Authorization: localStorage.getItem("Authorization")
    }
});

let localStorageToken = localStorage.getItem("Authorization");
let localStorageSession=localStorage.getItem("session");
let countTopicNumber=0;
let timer;

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
            Swal.fire(result.message,{
                buttons:{
                    OK:true,
                },
            })
            .then(()=>{
                location.href="/user/signin";
            });
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

document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
});

socket.emit("addSocketIdToData", localStorageToken);


//Get the required information
const Information= async function () {
    let res1 = await fetch("/api/1.0/needInformationStartGame",config);
    let user = await res1.json();

    let session1=localStorageSession.replace("\"","").replace("\"","");
    let topic=await fetchnewTopic(session1,countTopicNumber);

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


    let data = {user};
    let config2 ={
        method:"POST",
        headers:{
            Authorization:"Bearer "+localStorageToken,
            "Content-Type": "application/json"
        },
        body:JSON.stringify(data)
    };
    await fetch("/api/1.0/function/insertBuzzGameInfomation",config2);

    return {user, topic, sessionNumber};
};


//Dynamic page
Information().then(async function(res){

    let { sessionNumber } = res;
    let {topicEnglish,topicChinese} = res.topic;
    let { id,name,room  } = res.user;

    const currentTime = Date.parse(new Date());
    const deadline=new Date(currentTime +   10  *1000);
    initializeClock("clockdiv", deadline,id,sessionNumber,name,room);


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


    // Create english topic
    let englishTopicOutput = document.getElementById("topicEnglisg");
    let englishDiv = document.createElement("div");
    englishDiv.classList.add("topic");
    englishDiv.innerHTML=topicEnglish;
    englishTopicOutput.appendChild(englishDiv);

    


    //add listiner
    createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room);



    //if others correct after here will receive
    socket.on("event",async function(message){
    
        let {element,topicEnglish,topicChinese }=message;
        
        document.getElementById(element).style.opacity=0.3;
        document.getElementById("btn0").setAttribute("disabled","disabled");
        document.getElementById("btn1").setAttribute("disabled","disabled");
        document.getElementById("btn2").setAttribute("disabled","disabled");
        document.getElementById("btn3").setAttribute("disabled","disabled");
        document.getElementById("btn0").style.cursor="default";
        document.getElementById("btn1").style.cursor="default";
        document.getElementById("btn2").style.cursor="default";
        document.getElementById("btn3").style.cursor="default";
        document.getElementById(element).style.color="#000";
        setTimeout(async function(){
            countTopicNumber++;
            let data={id,countTopicNumber};
            socket.emit("updataTopicNumber",data);
            clearInterval(timer);
            let number = document.querySelector(".otherScoreNumber");
            number.innerHTML++;

            killChild();
            createEnglishTopic(topicEnglish);
            createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room);

            const currentTime = Date.parse(new Date());
            const deadline=new Date(currentTime +   11  *1000);
            initializeClock("clockdiv", deadline,id,sessionNumber,name,room);

        },1300);
    });

    //If othres wrong , here will receive it.
    socket.on("event2",async function(message){
        console.log(message);
        let i=message;
        document.getElementById("btn"+i).style.opacity=0.3;
        document.getElementById("btn"+i).setAttribute("disabled","disabled");
        document.getElementById("btn"+i).style.cursor="default";
        document.getElementById("btn"+i).style.color="#000"; 
    });

    //If both player wrong , here will receive it.
    socket.on("event3",async function(topic){
        clearInterval(timer);
        document.getElementById("btn0").setAttribute("disabled","disabled");
        document.getElementById("btn1").setAttribute("disabled","disabled");
        document.getElementById("btn2").setAttribute("disabled","disabled");
        document.getElementById("btn3").setAttribute("disabled","disabled");
        
        countTopicNumber++;
        setTimeout(async function(){
            killChild();
           
            let {topicEnglish,topicChinese} = topic;   
            createEnglishTopic(topicEnglish);
            createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room);
            
            const currentTime = Date.parse(new Date());
            const deadline=new Date(currentTime +   10  *1000);
            initializeClock("clockdiv", deadline,id,sessionNumber,name,room);
        },1300);
    });

    //When others player click button , here will receive the change screen first.
    socket.on("stopClick",function(i){
        document.getElementById("btn"+i).style.opacity=0.3;
        document.getElementById("btn"+i).setAttribute("disabled","disabled");
        document.getElementById("btn"+i).style.cursor="default";
        document.getElementById("btn"+i).style.color="#000"; 
    });


    //If this player win , will show Swal alert to user.
    socket.on("WinMessage",function(){
        Swal.fire({
            title:"Congratulations ,you win",
            imageUrl: "/image/win.jpg",
            imageWidth: 300,
            imageHeight: 300,
            buttons:{
                OK:true,
            },
        })
        .then(()=>{
            location.href="/contest/multi";
        });
    });


    //If this player lose , will show Swal alert to user.
    socket.on("LostMessage",function(){
        Swal.fire({
            title:"Sorry , you lose",
            imageUrl:"/image/lose.jpg",
            imageWidth: 330,
            imageHeight: 300,
            buttons:{
                OK:true,
            },
        })
        .then(()=>{
            location.href="/contest/multi";
        });
    });

});







//get new topic
async function fetchnewTopic(localStorageSession,countTopicNumber){
    let data = {session:localStorageSession,topicNumber:countTopicNumber};
    let config = {
        method:"POST",
        body:JSON.stringify(data),
        headers:{
            Authorization:"Bearer "+localStorageToken,
            "Content-Type": "application/json"
        }
    };
    let res = await fetch("/api/1.0/function/gameBuzzTopic",config);
    let topic =await res.json();
    return topic;
} 

//create english topic
function createEnglishTopic(topicEnglish){
    let englishTopicOutput = document.getElementById("topicEnglisg");
    let englishDiv = document.createElement("div");
    englishDiv.classList.add("topic");
    englishDiv.innerHTML=topicEnglish;
    englishTopicOutput.appendChild(englishDiv);
}


// create chinese option and add lisner
function createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room){
    for (let i=0;topicChinese.length>i;i++){

        let  div =document.getElementById("option");
        let  btn =document.createElement("button");
        btn.setAttribute("id","btn"+i);
        btn.classList.add("btn"+i);    
        btn.innerHTML =topicChinese[i];
        div.appendChild(btn);
        
        document.querySelector(".btn"+i).addEventListener("click",async function(){

            clickReaction();
            
            let english = topicEnglish;
            let option=document.querySelector(".btn"+i).textContent;
            let data={sessionNumber,english,id,name,option,room,countTopicNumber,i};
            socket.emit("confirmAnswer",data);
            socket.emit("click",i);
        });
    }
}

//======correct socket====
socket.on("correct",function(message){
    let { sessionNumber,id,name,room,i}=message;
    countTopicNumber++; 
    document.querySelector(".scoreNumber").innerHTML++;
    let click=document.querySelector(".btn"+i).className;  
    clearInterval(timer);
    createDisabled(click);
    let data={id,countTopicNumber};
    socket.emit("updataTopicNumber",data);

    let data2={click,countTopicNumber,localStorageSession};
    socket.emit("otherSessionCorrect",data2);
    socket.emit("updataCurrectNumberToSQL",{id});
    let information={sessionNumber,countTopicNumber,id,name,room };
    socket.emit("newTopic",information);
});

socket.on("createNewTopic",function(message){
    setTimeout(function(){
        let {topicEnglish,topicChinese,id,name,room,session}=message;
        let sessionNumber=message.session;
        killChild();
        createEnglishTopic(topicEnglish);
        createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room);
    
        const currentTime = Date.parse(new Date());
        const deadline=new Date(currentTime +   10  *1000);
        initializeClock("clockdiv", deadline,id,session,name,room);
    },1300);
});



//====error socket====
socket.on("error",function(message){
    let {id,sessionNumber,name,room,topicChinese,topicEnglish}=message;
    clearInterval(timer);
    countTopicNumber++;
    clickReaction();
    setTimeout(async function(){
        killChild();
        createEnglishTopic(topicEnglish);
        createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room);
    
        const currentTime = Date.parse(new Date());
        const deadline=new Date(currentTime +   10  *1000);
        initializeClock("clockdiv", deadline,id,sessionNumber,name,room);
    },1300);
});




socket.on("selfError",function(message){
    wrongDisabled(message);
});


//delete the option 
function killChild(){
    let deleteNode=document.querySelector(".topic");
    if (deleteNode){
        deleteNode.parentNode.removeChild(deleteNode);
    }
    let deleteNode2=document.querySelector(".btn0");
    if(deleteNode2){
        deleteNode2.parentNode.removeChild(deleteNode2);
    }
    let deleteNode3=document.querySelector(".btn1");
    if(deleteNode3){
        deleteNode3.parentNode.removeChild(deleteNode3);
    }
    let deleteNode4=document.querySelector(".btn2");
    if(deleteNode4){
        deleteNode4.parentNode.removeChild(deleteNode4);
    }
    let deleteNode5=document.querySelector(".btn3");
    if(deleteNode5){
        deleteNode5.parentNode.removeChild(deleteNode5);
    }
}





function clickReaction(){
    document.getElementById("btn0").setAttribute("disabled","disabled");
    document.getElementById("btn1").setAttribute("disabled","disabled");
    document.getElementById("btn2").setAttribute("disabled","disabled");
    document.getElementById("btn3").setAttribute("disabled","disabled");
    document.getElementById("btn0").style.cursor="default";
    document.getElementById("btn1").style.cursor="default";
    document.getElementById("btn2").style.cursor="default";
    document.getElementById("btn3").style.cursor="default";
}

//Response after correct answer
function createDisabled(element){
    document.getElementById(element).style.backgroundColor="#00FA9A";
    document.getElementById(element).style.color="#000";
}

//Response after error answer
function wrongDisabled(i){
    document.getElementById("btn0").setAttribute("disabled","disabled");
    document.getElementById("btn1").setAttribute("disabled","disabled");
    document.getElementById("btn2").setAttribute("disabled","disabled");
    document.getElementById("btn3").setAttribute("disabled","disabled");
    document.getElementById("btn0").style.cursor="default";
    document.getElementById("btn1").style.cursor="default";
    document.getElementById("btn2").style.cursor="default";
    document.getElementById("btn3").style.cursor="default";
    document.getElementById("btn"+i).style.backgroundColor="#FFC0C0";
    document.getElementById("btn"+i).style.color="#000";
}

// =============   clock function   ==============
function getTimeRemaining(endtime){
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor( (total/1000) % 60 );
    return {
        total,
        seconds
    };
}

function initializeClock(id, endtime,uid,sessionNumber,name,room) {
    const clock = document.getElementById(id);
    timer = setInterval(async () => {
        const t = getTimeRemaining(endtime);
        clock.innerHTML = t.seconds;
        if (t.total <= 0) {
            countTopicNumber++;
            clearInterval(timer);

            let data={uid,countTopicNumber};
            socket.emit("updataTopicNumber",data);

            killChild();
            let topic=await fetchnewTopic(sessionNumber,countTopicNumber);
            let {topicEnglish,topicChinese} = topic;
            createEnglishTopic(topicEnglish);
            createChineseOption(topicChinese,sessionNumber,topicEnglish,uid,name,room);

            const currentTime = Date.parse(new Date());
            const deadline=new Date(currentTime +   10  *1000);
            initializeClock("clockdiv", deadline,uid,sessionNumber,name,room);
        }
    },1000);
}


//exit btn
document.getElementById("exit").addEventListener("click",function(){
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to leave the game?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, I do!"
      }).then((result) => {
        if (result.isConfirmed) {
            window.location.href="/contest/multi";
            socket.emit("opponentLeaveGame","leave");
        }
      });
});

//Notify the other player.
socket.on("catchOpponentLeaveGame",function(){
    socket.emit("buzzOpponentLeaveGameSoYouWin","win");
    
    Swal.fire({
        title:"Your opponent left the game,Congratulations ,you win",
        imageUrl: "/image/win.jpg",
        imageWidth: 300,
        imageHeight: 300,
        buttons:{
            OK:true,
        },
    })
    .then(()=>{
        location.href="/contest/multi";
    });
});