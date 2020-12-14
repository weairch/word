// eslint-disable-next-line no-undef
const socket = io({
    query: {
        Authorization: localStorage.getItem("Authorization")
    }
});

let localStorageToken = localStorage.getItem("Authorization");
let localStorageSession=localStorage.getItem("session");
let countTopicNumber=0;



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

    let config5 = {
        method:"POST",
        headers:{
            session:localStorageSession,
            topicNumber:countTopicNumber,
            Authorization:"Bearer "+localStorageToken,
            "Content-Type": "application/json"
        }
    };
    let res = await fetch("/api/1.0/function/gameBuzzTopic",config5);
    let topic =await res.json();

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


//動態生成js
Information().then(async function(res){

    let { sessionNumber } = res;
    let {topicEnglish,topicChinese} = res.topic;
    let { id,name,room  } = res.user;

    // const currentTime = Date.parse(new Date());
    // const deadline=new Date(currentTime +   10  *1000);
    // let firstTimer=initializeClock("clockdiv", deadline,id,sessionNumber,name,room,countTopicNumber);

    //====================================這裡奇怪=====
    // let thirdTimer;
    // let secondTimer=setInterval(async function(){
    //     countTopicNumber++;
    //     const currentTime = Date.parse(new Date());
    //     const deadline=new Date(currentTime +   10  *1000);
    //     thirdTimer=initializeClock("clockdiv", deadline,id,sessionNumber,name,room,countTopicNumber,secondTimer,thirdTimer);
    // },10000) ;

    //========================================

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
    // createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room,firstTimer);


    socket.on("killer",function(){
        console.log("killer");
        //   clearInterval(firstTimer);
        clearInterval(secondTimer);
        clearInterval(thirdTimer);
    });

    socket.on("event",async function(message){
        countTopicNumber++;
        // clearInterval(firstTimer);
        clearInterval(secondTimer);
        clearInterval(thirdTimer);
        let number = document.querySelector(".otherScoreNumber");
        number.innerHTML++;
        let element=message;

        //updata now topic number
        await updataTopicNumber(id,countTopicNumber);
        document.getElementById(element).style.backgroundColor="#FFC0C0";
        document.getElementById("btn0").setAttribute("disabled","disabled");
        document.getElementById("btn1").setAttribute("disabled","disabled");
        document.getElementById("btn2").setAttribute("disabled","disabled");
        document.getElementById("btn3").setAttribute("disabled","disabled");
        document.getElementById("btn0").style.cursor="default";
        document.getElementById("btn1").style.cursor="default";
        document.getElementById("btn2").style.cursor="default";
        document.getElementById("btn3").style.cursor="default";
        document.getElementById(element).style.color="#f5f7f9";
        setTimeout(async function(){
            killChild();
            let topic=await newTopic(localStorageSession,countTopicNumber);
            let {topicEnglish,topicChinese} = topic;
            createEnglishTopic(topicEnglish);
            //timer
            
            // const currentTime = Date.parse(new Date());
            // const deadline=new Date(currentTime +   10  *1000);
            // firstTimer=initializeClock("clockdiv", deadline,id,sessionNumber,name,room,countTopicNumber);
            
            
            
            let thirdTimer;
            let secondTimer=setInterval(function(){
                countTopicNumber++;
                const currentTime = Date.parse(new Date());
                const deadline=new Date(currentTime +   10  *1000);
                thirdTimer=initializeClock("clockdiv", deadline,id,sessionNumber,name,room,countTopicNumber,secondTimer,thirdTimer);
            },10000) ;
            
            createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room);


        },2000);




    });

    socket.on("event2",async function(message){
        let element=message;
        document.getElementById(element).style.backgroundColor="#FFC0C0";
        document.getElementById(element).setAttribute("disabled","disabled");
        document.getElementById(element).style.cursor="default";
        document.getElementById(element).style.color="#f5f7f9"; 
    });

    socket.on("event3",async function(){
        document.getElementById("btn0").setAttribute("disabled","disabled");
        document.getElementById("btn1").setAttribute("disabled","disabled");
        document.getElementById("btn2").setAttribute("disabled","disabled");
        document.getElementById("btn3").setAttribute("disabled","disabled");

        // clearInterval(firstTimer);
        clearInterval(secondTimer);
        clearInterval(thirdTimer);
        //兩者都答錯了 就換題
        countTopicNumber++;
        setTimeout(async function(){
            killChild();
            let topic=await newTopic(localStorageSession,countTopicNumber);
            console.log(topic);
            let {topicEnglish,topicChinese} = topic;
            createEnglishTopic(topicEnglish);
            // const currentTime = Date.parse(new Date());
            // const deadline=new Date(currentTime +   10  *1000);
            // firstTimer=initializeClock("clockdiv", deadline,id,sessionNumber,name,room,countTopicNumber);
            // let thirdTimer;
            // secondTimer=setInterval(function(){
            //     countTopicNumber++;
            //     const currentTime = Date.parse(new Date());
            //     const deadline=new Date(currentTime +   10  *1000);
            //     thirdTimer=initializeClock("clockdiv", deadline,id,sessionNumber,name,room,countTopicNumber);
            // },10000) ;
            
            createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room);
            // createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room,firstTimer);
            
        },2000);

    });




});





//================================以下是function================================================








//get new topic
async function newTopic(localStorageSession,countTopicNumber){
    let config = {
        method:"POST",
        headers:{
            session:localStorageSession,
            topicNumber:countTopicNumber,
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
function createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room,secondTimer,thirdTimer){
// function createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room,firstTimer,secondTimer){
    for (let i=0;topicChinese.length>i;i++){
        let  div =document.getElementById("option");
        let  btn =document.createElement("button");
        btn.setAttribute("id","btn"+i);
        btn.classList.add("btn"+i);    
        btn.innerHTML =topicChinese[i];
        div.appendChild(btn);

        document.querySelector(".btn"+i).addEventListener("click",async function(){

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
                socket.emit("test","test");
                alert("恭喜答對");
                // clearInterval(firstTimer);
                clearInterval(secondTimer);
                clearInterval(thirdTimer);
                document.querySelector(".scoreNumber").innerHTML++;  //自己的分數++
                
                let click=document.querySelector(".btn"+i).className;  //通知房間其他人
                socket.emit("otherSessionCorrect",click);
                
                createDisabled(click);                //自己的頁面更新
                
                countTopicNumber++;                    //數自己下一題要達打什麼 更新自己答到哪一題
                await updataTopicNumber(id,countTopicNumber);
                
                setTimeout(async function(){            //過兩秒後做這件事情
                    killChild();
                    let config5 = {
                        method:"POST",
                        headers:{
                            session:localStorageSession,
                            topicNumber:countTopicNumber,
                            Authorization:"Bearer "+localStorageToken,
                            "Content-Type": "application/json"
                        }
                    };
                    let res = await fetch("/api/1.0/function/gameBuzzTopic",config5);
                    let topic =await res.json();
                    let {topicEnglish,topicChinese} = topic;
                    createEnglishTopic(topicEnglish);
                    //timer
                    // const currentTime = Date.parse(new Date());
                    // const deadline=new Date(currentTime +   10  *1000);
                    // firstTimer=initializeClock("clockdiv", deadline,id,sessionNumber,name,room,countTopicNumber);
                    
                    // let thirdTimer;
                    // let secondTimer=setInterval(function(){
                    //     countTopicNumber++;
                    //     const currentTime = Date.parse(new Date());
                    //     const deadline=new Date(currentTime +   10  *1000);
                    //     thirdTimer=initializeClock("clockdiv", deadline,id,sessionNumber,name,room,countTopicNumber,secondTimer,thirdTimer);
                    // },10000) ;

                    createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room);
                    // createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room,firstTimer,secondTimer);
                

                },2000);
            }


            else if (check.message == "error"){
                alert("答錯囉");
                let click=document.querySelector(".btn"+i).className;
                socket.emit("otherSessionWrong",click);
                document.getElementById(click).style.backgroundColor="#FFC0C0";
                wrongDisabled(click);
                

                let data={room,countTopicNumber};
                let config = {
                    method:"POST",
                    headers:{"Content-Type": "application/json"},
                    body:JSON.stringify(data)
                };
                let res= await fetch("/api/1.0/function/confirmStatus",config);
                let result =await res.json();
                if (result.message == "true"){
                    let status="false";
                    await updateGameStatus(id,status);
                }
                else{
                    console.log("我有到else這裡");
                    // clearInterval(firstTimer);
                    clearInterval(secondTimer);
                    clearInterval(thirdTimer);
                    countTopicNumber++;
                    let data={room};
                    let config = {
                        method:"POST",
                        headers:{"Content-Type": "application/json"},
                        body:JSON.stringify(data)
                    };
                    await fetch("/api/1.0/function/updataStatusAndNumber",config);
                    socket.emit("BothError","change Topic");
                    //換題了
                    setTimeout(async function(){
                        killChild();
                        let topic=await newTopic(localStorageSession,countTopicNumber);
                        let {topicEnglish,topicChinese} = topic;
                        createEnglishTopic(topicEnglish);


                        // const currentTime = Date.parse(new Date());
                        // const deadline=new Date(currentTime +   10  *1000);
                        // firstTimer=initializeClock("clockdiv", deadline,id,sessionNumber,name,room,countTopicNumber);
                        
                        // let thirdTimer;
                        // secondTimer=setInterval(function(){
                        //     countTopicNumber++;
                        //     const currentTime = Date.parse(new Date());
                        //     const deadline=new Date(currentTime +   10  *1000);
                        //     thirdTimer=initializeClock("clockdiv", deadline,id,sessionNumber,name,room,countTopicNumber);
                        // },10000) ;
                        
                        createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room);
                        // createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room,firstTimer);
                        //timer
                    
                    },2000);

                }
            }
        });
    }
}

//set timeIntervel




//updata topic number
async function updataTopicNumber(id,countTopicNumber){
    console.log("在上面的function");
    //updata now topic number
    let data={id,countTopicNumber};
    let config = {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(data)
    };
    await fetch("/api/1.0/function/nowGameTopicNnumber",config);
}

async function updateGameStatus(id,status){
    let data={id,status};
    let config = {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(data)
    };
    await fetch("/api/1.0/function/updataTopicError",config);

}


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






// =============   clock function   ==============
function getTimeRemaining(endtime){
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor( (total/1000) % 60 );
    return {
        total,
        seconds
    };
}

function initializeClock(id, endtime,uid,sessionNumber,name,room,countTopicNumber,secondTimer,thirdTimer) {
// function initializeClock(id, endtime,uid,sessionNumber,name,room,countTopicNumber,firstTimer,secondTimer) {
    const clock = document.getElementById(id);
    const timeinterval = setInterval(async () => {
        const t = getTimeRemaining(endtime);
        clock.innerHTML = "seconds:" + t.seconds;
        if (t.total <= 0) {
            countTopicNumber++;
            clearInterval(timeinterval);
            clearInterval(secondTimer);
            clearInterval(thirdTimer);
            await updataTopicNumber(uid,countTopicNumber);
            let data={id};
            let config = {
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body:JSON.stringify(data)
            };
            await fetch("/api/1.0/function/updataTimeOutTopicNumber",config);
            killChild();
            let topic=await newTopic(localStorageSession,countTopicNumber);
            let {topicEnglish,topicChinese} = topic;
            createEnglishTopic(topicEnglish);
            createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room);
        }
    },1000);
    return timeinterval;
}




// const timer = setInterval(async function(){
//     let data={room,countTopicNumber};
//     let config = {
//         method:"POST",
//         headers:{"Content-Type": "application/json"},
//         body:JSON.stringify(data)
//     };
//     let res=await fetch("/api/1.0/function/countBuzzGameRoomStatusIsNull",config);
//     let result=await res.json();
//     //result 有東西 就要跳進下一題
//     if (result){
//         //更新sql裡面的下一題
//         let data={id};
//         let config = {
//             method:"POST",
//             headers:{"Content-Type": "application/json"},
//             body:JSON.stringify(data)
//         };
//         await fetch("/api/1.0/function/updataTimeOutTopicNumber",config);
//         countTopicNumber++;
//         killChild();
//         let topic=await newTopic(localStorageSession,countTopicNumber);
//         let {topicEnglish,topicChinese} = topic;
//         createEnglishTopic(topicEnglish);
//         createChineseOption(topicChinese,sessionNumber,topicEnglish,id,name,room,timer);
//         console.log(countTopicNumber);
//     }
//     else if (countTopicNumber ==30){
//         clearInterval(timer);
//     }
// },5000);