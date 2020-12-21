/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
/* eslint-disable indent */
const socket = io({
    query: {
        Authorization: localStorage.getItem("Authorization")
    }
});

document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
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
    console.log(sessionNumber);
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
        btn.setAttribute("id","btn"+i); 
        btn.innerHTML =chinese[i];
        div.appendChild(btn);
        document.querySelector(".btn"+i).addEventListener("click",function(){
            answer(i,sessionNumber,english,id,name,room);    
        });
    }
});



//click function
async function answer(i,sessionNumber,english,id,name,room){
    document.getElementById("btn0").disabled=true;
    document.getElementById("btn1").disabled=true;
    document.getElementById("btn2").disabled=true;
    document.getElementById("btn3").disabled=true;
    document.getElementById("btn0").style.cursor="default";
    document.getElementById("btn1").style.cursor="default";
    document.getElementById("btn2").style.cursor="default";
    document.getElementById("btn3").style.cursor="default";

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
        socket.emit("otherOneChangeTopic","currect");
        document.getElementById("btn"+i).style.backgroundColor="#00FA9A";
        document.getElementById("btn"+i).style.color="#f5f7f9";
        
        
        document.querySelector(".scoreNumber").innerHTML++;
        
        
        let res = await fetch("/api/1.0/function/randomWord");
        let topic = await res.json();
        let { english,chinese } = topic;
 
        setTimeout(function(){
            document.querySelector(".topic").innerHTML=english;
            let  div =document.getElementById("option");
            div.innerHTML="";
            for (let i=0;chinese.length>i;i++){
                let  div =document.getElementById("option");
                let  btn =document.createElement("button");
                btn.classList.add("btn"+i);  
                btn.setAttribute("id","btn"+i);         
                btn.innerHTML =chinese[i];
                div.appendChild(btn);
                document.querySelector(".btn"+i).addEventListener("click",function(){
                    answer(i,sessionNumber,english,id,name);    
                });
            }
        },500);
    }


    else if (check.message == "error"){
        document.getElementById("btn"+i).style.backgroundColor="#FFC0C0";
        document.getElementById("btn"+i).style.color="#f5f7f9";

        let res = await fetch("/api/1.0/function/randomWord");
        let topic = await res.json();
        let { english,chinese } = topic;
        console.log(english,chinese);
        document.querySelector(".topic").innerHTML=english;
        let  div =document.getElementById("option");
        setTimeout(function(){
            div.innerHTML="";
            for (let i=0;chinese.length>i;i++){
                let  div =document.getElementById("option");
                let  btn =document.createElement("button");
                btn.classList.add("btn"+i);    
                btn.setAttribute("id","btn"+i);       
                btn.innerHTML =chinese[i];
                div.appendChild(btn);
                document.querySelector(".btn"+i).addEventListener("click",function(){
                    answer(i,sessionNumber,english,id,name);    
                });
            }
        },500);
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
        clock.innerHTML =t.seconds;
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
                    swal(result.message,{
                        buttons:{
                            OK:true,
                        },
                    })
                    .then(()=>{
                        location.href="/contest/multi";
                    });
                });
        }
    },1000);
}


