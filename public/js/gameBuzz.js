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

document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
});

socket.emit("addSocketIdToData", localStorageToken);


//拿取所需要的資訊
const Information= async function () {
    let res1 = await fetch("/api/1.0/needInformationStartGame",config);
    let user = await res1.json();

    // let res2 = await fetch("/api/1.0/function/randomWord",config);
    // let topic = await res2.json();
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

    return {user, sessionNumber};
    // return {user, topic, sessionNumber};
};


//動態生成js
Information().then(async function(res){

    let { sessionNumber } = res;
    // let { english,chinese } = res.topic;
    let { id,name,room  } = res.user;

    // const currentTime = Date.parse(new Date());
    // const deadline=new Date(currentTime +   100  *1000);
    // initializeClock("clockdiv", deadline,sessionNumber,id);


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




    let localStorageSession=localStorage.getItem("session");
    let countTopicNumber=0;

    const timer =setInterval(async function(){
        let config = {
            method:"POST",
            headers:{
                session:localStorageSession,
                topicNumber:countTopicNumber,
                Authorization:"Bearer "+localStorageToken,
                "Content-Type": "application/json"
            }
        };

        killChild();
        countTopicNumber++;
        if (countTopicNumber == 30){
            clearInterval(timer);
        }

        let res = await fetch("/api/1.0/function/gameBuzzTopic",config);
        let result =await res.json();
        let {topicEnglish,topicChinese,topicNumber} = result;


        // Create english topic
        let englishTopicOutput = document.getElementById("topicEnglisg");
        let englishDiv = document.createElement("div");
        englishDiv.classList.add("topic");
        englishDiv.innerHTML=topicEnglish;
        englishTopicOutput.appendChild(englishDiv);


        //Create option
        for (let i=0;topicChinese.length>i;i++){
            let  div =document.getElementById("option");
            let  btn =document.createElement("button");
            btn.setAttribute("id","btn"+i);
            btn.classList.add("btn"+i);    
            btn.innerHTML =topicChinese[i];
            div.appendChild(btn);

            
            document.querySelector(".btn"+i).addEventListener("click",async function(){
                // answer(i,sessionNumber,topicEnglish,id,name,room);    
                let english = topicEnglish;
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
                    let click=document.querySelector(".btn"+i).className;
                    //通知房間其他人
                    // clearInterval(timer);
                    createDisabled(click);
                    alert("恭喜答對");
                    socket.emit("otherSessionCorrect",click);
                    document.querySelector(".scoreNumber").innerHTML++;
                    
                }


                else if (check.message == "error"){
                    alert("答錯囉");
                    let click=document.querySelector(".btn"+i).className;
                    socket.emit("otherSessionWrong",click);
                    document.getElementById(click).style.backgroundColor="#FFC0C0";
                    wrongDisabled(click);
                }
            });
        }


    },7000);



    socket.on("event",function(message){

        let number = document.querySelector(".otherScoreNumber");
        number.innerHTML++;
        let element=message;
        document.getElementById(element).style.backgroundColor="#FFC0C0";
        document.getElementById(element).setAttribute("disabled","disabled");
        document.getElementById(element).style.cursor="default";
        document.getElementById(element).style.color="#f5f7f9";
    });



    socket.on("event2",function(message){
        let element=message;
        document.getElementById(element).style.backgroundColor="#FFC0C0";
        document.getElementById(element).setAttribute("disabled","disabled");
        document.getElementById(element).style.cursor="default";
        document.getElementById(element).style.color="#f5f7f9";

    });

});



//刪掉原本頁面上有的資訊

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



//答對後反應
function createDisabled(element){
    document.getElementById("btn0").setAttribute("disabled","disabled");
    document.getElementById("btn1").setAttribute("disabled","disabled");
    document.getElementById("btn2").setAttribute("disabled","disabled");
    document.getElementById("btn3").setAttribute("disabled","disabled");
    document.getElementById("btn0").style.cursor="default";
    document.getElementById("btn1").style.cursor="default";
    document.getElementById("btn2").style.cursor="default";
    document.getElementById("btn3").style.cursor="default";
    document.getElementById(element).style.backgroundColor="#00FA9A";
    document.getElementById(element).style.color="#f5f7f9";
}



//答錯後反應
function wrongDisabled(element){
    document.getElementById("btn0").setAttribute("disabled","disabled");
    document.getElementById("btn1").setAttribute("disabled","disabled");
    document.getElementById("btn2").setAttribute("disabled","disabled");
    document.getElementById("btn3").setAttribute("disabled","disabled");
    document.getElementById("btn0").style.cursor="default";
    document.getElementById("btn1").style.cursor="default";
    document.getElementById("btn2").style.cursor="default";
    document.getElementById("btn3").style.cursor="default";
    document.getElementById(element).style.backgroundColor="#FFC0C0";
    document.getElementById(element).style.color="#f5f7f9";
}






//=============   clock function   ==============
// function getTimeRemaining(endtime){
//     const total = Date.parse(endtime) - Date.parse(new Date());
//     const seconds = Math.floor( (total/1000) % 60 );
//     return {
//         total,
//         seconds
//     };
// }

// function initializeClock(id, endtime,Session,uid) {
//     const clock = document.getElementById(id);
//     const timeinterval = setInterval(() => {
//         const t = getTimeRemaining(endtime);
//         clock.innerHTML = "seconds:" + t.seconds;
//         if (t.total <= 0) {
//             clearInterval(timeinterval);

//             let data = {Session,uid};
//             let config ={
//                 method:"POST",
//                 headers:{
//                     "Content-Type": "application/json",
//                 },
//                 body:JSON.stringify(data)
//             };
//             fetch("/api/1.0/function/lostOrWin",config)
//                 .then(function(res){
//                     return res.json();
//                 })
//                 .then(function(result){
//                     alert(result.message);
//                     location.href="/contest/multi";
//                 });
//         }
//     },1000);
// }














//click function
// async function answer(i,sessionNumber,english,id,name,room){



//     console.log(sessionNumber);
//     let option=document.querySelector(".btn"+i).textContent;
//     let data={sessionNumber,english,id,name,option,room};
//     let config={
//         method:"POST",
//         headers:{
//             Authorization:"Bearer "+localStorageToken,
//             "Content-Type": "application/json",
//         },
//         body:JSON.stringify(data)
//     };
//     let res = await fetch("/api/1.0/function/confirmAnswer",config);
//     let check = await res.json();


//     if (check.message == "correct"){
//         let click=document.querySelector(".btn"+i).className;
//         //通知房間其他人
//         socket.emit("otherSessionCorrect",click);


//         alert("恭喜答對");
        
        
//         document.querySelector(".scoreNumber").innerHTML++;
        
        //這裡吃不到
        // clearInterval(timer)
        
        // let res = await fetch("/api/1.0/function/randomWord");
        // let topic = await res.json();
        // let { english,chinese } = topic;
        // console.log(english,chinese);
        // document.querySelector(".topic").innerHTML=english;
        // let  div =document.getElementById("option");
        // div.innerHTML="";
        // for (let i=0;chinese.length>i;i++){
        //     let  div =document.getElementById("option");
        //     let  btn =document.createElement("button");
        //     btn.classList.add("btn"+i);          
        //     btn.innerHTML =chinese[i];
        //     div.appendChild(btn);
        //     document.querySelector(".btn"+i).addEventListener("click",function(){
        //         answer(i,sessionNumber,english,id,name);    
        //     });
        // }
    // }


    // else if (check.message == "error"){

    //     alert("答錯囉");
        // let res = await fetch("/api/1.0/function/randomWord");
        // let topic = await res.json();
        // let { english,chinese } = topic;
        // console.log(english,chinese);
        // document.querySelector(".topic").innerHTML=english;
        // let  div =document.getElementById("option");
        // div.innerHTML="";
        // for (let i=0;chinese.length>i;i++){
        //     let  div =document.getElementById("option");
        //     let  btn =document.createElement("button");
        //     btn.classList.add("btn"+i);          
        //     btn.innerHTML =chinese[i];
        //     div.appendChild(btn);
        //     document.querySelector(".btn"+i).addEventListener("click",function(){
        //         // eslint-disable-next-line no-unused-vars
        //         answer(i,sessionNumber,english,id,name);    
        //     });
        // }
//     }
// }



