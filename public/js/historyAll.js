
//checek signin
let localStorageToken = localStorage.getItem("Authorization");

let config1 = {
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
            alert(result.message);
            location.href="/admin/signin";
        }
        else{
            document.getElementById("name").innerHTML="玩家名稱: "+result.name;
        }
    })
    .catch(function(err){
        console.log(err);
    });



document.getElementById("single").addEventListener("click",function(){
    // let node = document.getElementById("session");
    // let session=document.querySelector("sessionNunber");
    // node.removeChild(session);
    //只允許點擊一次
    document.getElementById("single").setAttribute("disabled","discbled");
    let config = {
        method:"GET",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorageToken,
        }
    };
    const Information= async function () {
        let userHistory=await fetch("/api/1.0/history/single",config);
        let userHistoryAll =await userHistory.json();
        return userHistoryAll;
    };
    Information().then(function(result){
        console.log(result);
        //create session and time
        let session = document.getElementById("session");
        let sessionAll=result.session;
        for (let i=0; Object.keys(sessionAll).length>i ;i++){
            let key=Object.keys(sessionAll)[i];
            let value = sessionAll[key];
            
            let sessionDiv=document.createElement("div");
            let timeDiv=document.createElement("div");
            sessionDiv.setAttribute("id",i);
            sessionDiv.classList.add("sessionNumber");

            sessionDiv.innerHTML=key;
            timeDiv.innerHTML=value;
            session.appendChild(sessionDiv);
            session.appendChild(timeDiv);
        }
    });
});


document.getElementById("multi").addEventListener("click",function(){
    document.getElementById("multi").setAttribute("disabled","discbled");

    let config = {
        method:"GET",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorageToken,
        }
    };
    const Information= async function () {
        let userHistory=await fetch("/api/1.0/history/multi",config);
        let userHistoryAll =await userHistory.json();
        return userHistoryAll;
    };
    Information().then(function(result){
        console.log(result);
        let session = document.getElementById("session");
        let sessionAll=result.session;
        for (let i=0; Object.keys(sessionAll).length>i ;i++){
            let key=Object.keys(sessionAll)[i];
            let value = sessionAll[key];
            
            let sessionDiv=document.createElement("div");
            let timeDiv=document.createElement("div");
            sessionDiv.setAttribute("id",i);
            sessionDiv.classList.add("sessionNumber");

            sessionDiv.innerHTML=key;
            timeDiv.innerHTML=value;
            session.appendChild(sessionDiv);
            session.appendChild(timeDiv);
        }
    });
});

document.getElementById("title").addEventListener("click",function(){
    location.href="/";
});



// let config2 = {
//     method:"GET",
//     headers:{
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + localStorageToken,
//     }
// };


// const Information= async function () {
//     let userHistory=await fetch("/api/1.0/history/all",config2);
//     let userHistoryAll =await userHistory.json();
//     return userHistoryAll;
// };

// Information().then(function(res){
//     //create userid
//     let id=document.getElementById("userid");
//     let userid=res.id;
//     let userDiv=document.createElement("div");
//     userDiv.classList.add("userId");
//     userDiv.innerHTML=userid;
//     id.appendChild(userDiv);

//     //create username    
//     let name = document.getElementById("name");
//     let username=res.name;
//     let usernameDiv=document.createElement("div");
//     usernameDiv.innerHTML=username;
//     name.appendChild(usernameDiv);


//     //create session and time
//     let session = document.getElementById("session");
//     let sessionAll=res.session;
//     for (let i=0; Object.keys(sessionAll).length>i ;i++){
//         let key=Object.keys(sessionAll)[i];
//         let value = sessionAll[key];
        
//         let sessionDiv=document.createElement("div");
//         let timeDiv=document.createElement("div");
//         // sessionDiv.setAttribute("id",i);
//         sessionDiv.classList.add("sessionNumber"+i);


//         sessionDiv.innerHTML=key;
//         timeDiv.innerHTML=value;
        

//         session.appendChild(sessionDiv);
//         session.appendChild(timeDiv);
        

//         let sessionNumber=document.querySelector(".sessionNumber"+i).textContent;
//         let userid=document.querySelector(".userId").textContent;

//         document.querySelector(".sessionNumber"+i).addEventListener("click",function(){
//             click(i,userid,sessionNumber);
//         });

//     }


// });


// async function click(j,userid,value){

//     let data = {userid,session:value};
//     let config = {
//         method:"POST",
//         body:JSON.stringify(data),
//         headers:{
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + localStorageToken,
//         }
//     };
//     let res=await fetch("/api/1.0/history/detaile",config);
//     let result = await res.json();

//     let key = Object.keys(result);
//     for (let i=0;key.length>i;i++){

//         let keys= key[i];
//         let value=result[key[i]];

//         let session = document.querySelector(".sessionNumber"+j);
//         let detailDiv=document.createElement("div");
//         detailDiv.classList.add("Answer"+i);
//         detailDiv.innerHTML="題目:"+keys+"作答:"+value;
//         session.appendChild(detailDiv);

//         //==============================點擊可以把原本的有的消除 不起作用???? 前端範疇
//         document.querySelector(".Answer"+i).addEventListener("click",function(){
//             clear(j);   
//         });
//         //==============================
//     }
// }


// async function clear(j){
    
//     let Answer = document.querySelector(".sessionNumber"+j);
//     while(Answer.firstChild) { 
//         Answer.removeChild(Answer.firstChild); 
//     } 
//     // Answer.innerHTML="none";
// }