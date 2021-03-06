/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
/* eslint-disable indent */
const socket=io({
    query: {
        Authorization: localStorage.getItem("Authorization")
    }
});


document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
});


let localStorageToken=localStorage.getItem("Authorization");


let checkUserTokenConfig={
    method:"POST",
    headers:{
        Authorization:"Bearer "+localStorageToken,
        "Content-Type": "application/json"
    }
};
fetch("",checkUserTokenConfig)
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



let config={
    method: "GET",
    headers: {
        Authorization: "Bearer " + localStorageToken,
        "Content-Type": "application/json"
    }
};

socket.emit("addSocketIdToData", localStorageToken);

//Get the required information
const Information=async function () {
    let res1=await fetch("/api/1.0/getInformationStartGame",config);
    let user=await res1.json();

    let res2=await fetch("/api/1.0/function/randomWord",config);
    let topic=await res2.json();

    let session={
        method:"GET",
        headers:{
            Authorization:"Bearer "+localStorageToken,
            "Content-Type": "application/json",
            uid:user.id
        }
    };
    let res3=await fetch("/api/1.0/function/getSessionNumber",session);
    let sessionNumber=await res3.json();

    return {user, topic, sessionNumber};
};


//Dynamic page
Information().then(function(res){

    let { sessionNumber }=res;
    let { english,chinese }=res.topic;
    let { id,name,room  }=res.user;


    socket.on("event",function(){
        let number=document.querySelector(".otherScoreNumber");
        number.innerHTML++;

    });

    //countdown timer 
    const currentTime=Date.parse(new Date());
    const deadline=new Date(currentTime +   30  *1000);
    initializeClock("clockdiv", deadline,sessionNumber,id);




    //Create english topic
    let englishTopicOutput=document.getElementById("topicEnglisg");
    let englishDiv=document.createElement("div");
    englishDiv.classList.add("topic");
    englishDiv.innerHTML=english;
    englishTopicOutput.appendChild(englishDiv);




    //Create self score 
    let score=document.getElementById("score");
    let scoreDiv=document.createElement("div");
    scoreDiv.classList.add("scoreNumber");
    scoreDiv.innerHTML=0;
    score.appendChild(scoreDiv);


    //Create other score
    let ortherScore=document.getElementById("otherScore");
    let ortherScoreDiv=document.createElement("div");
    ortherScoreDiv.classList.add("otherScoreNumber");
    ortherScoreDiv.innerHTML=0;
    ortherScore.appendChild(ortherScoreDiv);



    //Create option  
    for (let i=0;chinese.length>i;i++){
        let  div=document.getElementById("option");
        let  btn=document.createElement("button");
        btn.classList.add("btn"+i);          
        btn.setAttribute("id","btn"+i); 
        btn.innerHTML=chinese[i];
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
    let res=await fetch("/api/1.0/function/confirmAnswer",config);
    let check=await res.json();


    if (check.message == "correct"){

        //Notify other players
        socket.emit("otherOneChangeTopic","currect");
        document.getElementById("btn"+i).style.backgroundColor="#00FA9A";
        document.getElementById("btn"+i).style.color="#000";
        
        
        document.querySelector(".scoreNumber").innerHTML++;
        
        
        let res=await fetch("/api/1.0/function/randomWord");
        let topic=await res.json();
        let { english,chinese }=topic;
 
        setTimeout(function(){
            document.querySelector(".topic").innerHTML=english;
            let  div=document.getElementById("option");
            div.innerHTML="";
            for (let i=0;chinese.length>i;i++){
                let  div=document.getElementById("option");
                let  btn=document.createElement("button");
                btn.classList.add("btn"+i);  
                btn.setAttribute("id","btn"+i);         
                btn.innerHTML=chinese[i];
                div.appendChild(btn);
                document.querySelector(".btn"+i).addEventListener("click",function(){
                    answer(i,sessionNumber,english,id,name);    
                });
            }
        },500);
    }


    else if (check.message == "error"){
        document.getElementById("btn"+i).style.backgroundColor="#FFC0C0";
        document.getElementById("btn"+i).style.color="#000";

        let res=await fetch("/api/1.0/function/randomWord");
        let topic=await res.json();
        let { english,chinese }=topic;

        document.querySelector(".topic").innerHTML=english;
        let  div=document.getElementById("option");
        setTimeout(function(){
            div.innerHTML="";
            for (let i=0;chinese.length>i;i++){
                let  div=document.getElementById("option");
                let  btn=document.createElement("button");
                btn.classList.add("btn"+i);    
                btn.setAttribute("id","btn"+i);       
                btn.innerHTML=chinese[i];
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
    const total=Date.parse(endtime) - Date.parse(new Date());
    const seconds=Math.floor( (total/1000) % 60 );
    return {
        total,
        seconds
    };
}

function initializeClock(id, endtime,Session,uid) {
    const clock=document.getElementById(id);
    const timeinterval=setInterval(async() => {
        const t=getTimeRemaining(endtime);
        clock.innerHTML=t.seconds;
        if (t.total <= 0) {
            clearInterval(timeinterval);

            let data={Session,uid};
            let config={
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(data)
            };
            let res=await fetch("/api/1.0/function/getLostOrWin",config);
            let result=await res.json();
            if (result.message =="Congratulations,you win"){
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
            }
            else if (result.message == "deuce"){
                Swal.fire(result.message,{
                    buttons:{
                        OK:true,
                    },
                })
                .then(()=>{
                    location.href="/contest/multi";
                });
            }
            else if (result.message == "Sorry,you lose"){
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
            }
        }
    },1000);
}


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

socket.on("catchOpponentLeaveGame",function(){
    socket.emit("scoreOpponentLeaveGameSoYouWin","win");


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