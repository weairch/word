/* eslint-disable indent */
/* eslint-disable no-undef */


let localStorageToken=localStorage.getItem("Authorization");


document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
});



let config1={
    method:"POST",
    headers:{
        Authorization:"Bearer "+localStorageToken,
        "Content-Type": "application/json"
    }
};


fetch("/api/1.0/checkUserToken",config1)
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



let config2={
    method: "GET",
    headers: {
        Authorization: "Bearer " + localStorageToken,
        "Content-Type": "application/json"
    }
};

const Information=async function () {
    let res1=await fetch("/api/1.0/getInformationStartGame",config2);
    let user=await res1.json();
    let res2=await fetch("/api/1.0/function/randomWord",config2);
    let topic=await res2.json();
    let res3=await fetch("/api/1.0/function/getRandomSession",config2);
    let sessionNumber=await res3.json();
    return {user, topic ,sessionNumber};
};


// eslint-disable-next-line no-unused-vars
async function Ready(){
    document.getElementById("Ready").style.display="none";
    

    Information().then(async function(res){
        let { english,chinese }=res.topic;
        let { id,name}=res.user;
        let sessionNumber=res.sessionNumber.randomSession;


        let data={id,sessionNumber};
        let config={
            method: "POST",
            body:JSON.stringify(data),
            headers: {
                Authorization: "Bearer " + localStorageToken,
                "Content-Type": "application/json"
            }
        };
        
        //Record game data
        await fetch("/api/1.0/function/addSingleModeAndSession",config);
  
        //countdown timer ,Set the number of seconds here
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





        //Create option  
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


    });
}


async function answer(i,sessionNumber,english,id,name){
    document.getElementById("btn0").disabled=true;
    document.getElementById("btn1").disabled=true;
    document.getElementById("btn2").disabled=true;
    document.getElementById("btn3").disabled=true;
    document.getElementById("btn0").style.cursor="default";
    document.getElementById("btn1").style.cursor="default";
    document.getElementById("btn2").style.cursor="default";
    document.getElementById("btn3").style.cursor="default";
    let option=document.querySelector(".btn"+i).textContent;
    let data={sessionNumber,english,id,name,option};
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
        document.getElementById("btn"+i).style.color="#000";
        document.getElementById("btn"+i).style.backgroundColor="#00FA9A";

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
            window.location.href="/";
        }
      });
});


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
    const timeinterval=setInterval(() => {
        const t=getTimeRemaining(endtime);
        clock.innerHTML=t.seconds;
        if (t.total <= 0) {
            clearInterval(timeinterval);
            let data={uid,Session};
            let config={
                method:"POST",
                headers:{
                    Authorization:"Bearer "+localStorageToken,
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(data)
            };

            fetch("/api/1.0/function/getSinglePlayerResult",config)
                .then(function(res){
                    return res.json();
                })
                .then(function(result){


                    Swal.fire(result.message,{
                        buttons:{
                            OK:true,
                        },
                    })
                    .then(()=>{
                        location.href="/";
                    });
                    

                });
            
        }
    },1000);
}