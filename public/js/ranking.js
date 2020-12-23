/* eslint-disable no-undef */

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
            Swal.fire(result.message);
            Swal.fire(result.message,{
                buttons:{
                    OK:true,
                },
            })
                .then(()=>{
                    location.href="/admin/signin";
                });
        }
    })
    .catch(function(err){
        console.log(err);
    });





document.getElementById("Score").addEventListener("click",async function(){
    let res =await fetch("/api/1.0/ranking/score");
    let resulet =await res.json();
    let total=resulet.score;
    let topNode=document.getElementById("session");
    topNode.innerHTML="";
    
    for (let i=0;total.length>i;i++){
        let name=total[i].split(",")[0];
        let score=total[i].split(",")[1];
        let secondnode=document.createElement("div");
        secondnode.classList.add("scoreRank");

        let nameDiv=document.createElement("div");
        nameDiv.classList.add("name");
        nameDiv.innerHTML=name;
        
        let scoreDiv=document.createElement("div");
        scoreDiv.classList.add("fraction");
        scoreDiv.innerHTML=score;
        
        secondnode.appendChild(nameDiv);
        secondnode.appendChild(scoreDiv);
        topNode.appendChild(secondnode);
    }
});


document.getElementById("Buzz").addEventListener("click",async function(){
    
    let res =await fetch("/api/1.0/ranking/buzz");
    let resulet =await res.json();
    let total=resulet.score;
    let topNode=document.getElementById("session");
    topNode.innerHTML="";
    
    for (let i=0;total.length>i;i++){
        let name=total[i].split(",")[0];
        let score=total[i].split(",")[1];
        let secondnode=document.createElement("div");
        secondnode.classList.add("scoreRank");

        let nameDiv=document.createElement("div");
        nameDiv.classList.add("name");
        nameDiv.innerHTML=name;
        
        let scoreDiv=document.createElement("div");
        scoreDiv.classList.add("fraction");
        scoreDiv.innerHTML=score;
        
        secondnode.appendChild(nameDiv);
        secondnode.appendChild(scoreDiv);
        topNode.appendChild(secondnode);
    }

    
});


// document.getElementById("Score").addEventListener("click",function(){
//     //只允許點擊一次
//     document.getElementById("single").setAttribute("disabled","discbled");
//     let config = {
//         method:"GET",
//         headers:{
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + localStorageToken,
//         }
//     };
//     const Information= async function () {
//         let userHistory=await fetch("/api/1.0/history/single",config);
//         let userHistoryAll =await userHistory.json();
//         return userHistoryAll;
//     };
//     Information().then(function(result){
//         //create session and time
//         let session = document.getElementById("session");
//         let sessionAll=result.session;
//         for (let i=0; Object.keys(sessionAll).length>i ;i++){
//             let key=Object.keys(sessionAll)[i];
//             let value = sessionAll[key];
            
//             let sessionDiv=document.createElement("div");
//             let timeDiv=document.createElement("div");
//             sessionDiv.setAttribute("id",i);
//             sessionDiv.classList.add("sessionNumber");

//             sessionDiv.innerHTML=key;
//             timeDiv.innerHTML=value;
//             session.appendChild(sessionDiv);
//             session.appendChild(timeDiv);
//         }
//     });
// });


// document.getElementById("Buzz").addEventListener("click",function(){
//     document.getElementById("multi").setAttribute("disabled","discbled");

//     let config = {
//         method:"GET",
//         headers:{
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + localStorageToken,
//         }
//     };
//     const Information= async function () {
//         let userHistory=await fetch("/api/1.0/history/multi",config);
//         let userHistoryAll =await userHistory.json();
//         return userHistoryAll;
//     };
//     Information().then(function(result){
//         // console.log(result);
//         let session = document.getElementById("session");
//         let sessionAll=result.session;
//         for (let i=0; Object.keys(sessionAll).length>i ;i++){
//             let key=Object.keys(sessionAll)[i];
//             let value = sessionAll[key];
            
//             let sessionDiv=document.createElement("div");
//             let timeDiv=document.createElement("div");
//             sessionDiv.setAttribute("id",i);
//             sessionDiv.classList.add("sessionNumber");

//             sessionDiv.innerHTML=key;
//             timeDiv.innerHTML=value;
//             session.appendChild(sessionDiv);
//             session.appendChild(timeDiv);
//         }
//     });
// });

document.getElementById("title").addEventListener("click",function(){
    location.href="/";
});
