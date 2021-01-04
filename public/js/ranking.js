/* eslint-disable no-undef */

//checek signin
let localStorageToken=localStorage.getItem("Authorization");

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
            Swal.fire(result.message);
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




document.getElementById("Score").addEventListener("click",async function(){
    let res=await fetch("/api/1.0/ranking/score");
    let resulet=await res.json();
    let total=resulet.score;
    let topNode=document.getElementById("session");
    topNode.innerHTML="";
    

    let secondnode=document.createElement("div");
    secondnode.classList.add("scoreRank");

    let nameDiv=document.createElement("div");
    nameDiv.classList.add("nameTitle");
    nameDiv.innerHTML="Name";
    
    let scoreDiv=document.createElement("div");
    scoreDiv.classList.add("fractionTitle");
    scoreDiv.innerHTML="Total win";
    
    secondnode.appendChild(nameDiv);
    secondnode.appendChild(scoreDiv);
    topNode.appendChild(secondnode);

    for (let i=0;total.length>i;i++){
        let imageSrc="/image/"+(i+1)+".png";
        createRanking(topNode,total,i,imageSrc);
    }
});




document.getElementById("Buzz").addEventListener("click",async function(){
    
    let res=await fetch("/api/1.0/ranking/buzz");
    let resulet=await res.json();
    let total=resulet.score;
    let topNode=document.getElementById("session");
    topNode.innerHTML="";
    

    let secondnode=document.createElement("div");
    secondnode.classList.add("scoreRank");

    let nameDiv=document.createElement("div");
    nameDiv.classList.add("nameTitle");
    nameDiv.innerHTML="Name";
    
    let scoreDiv=document.createElement("div");
    scoreDiv.classList.add("fractionTitle");
    scoreDiv.innerHTML="Total win";
    
    secondnode.appendChild(nameDiv);
    secondnode.appendChild(scoreDiv);
    topNode.appendChild(secondnode);



    for (let i=0;total.length>i;i++){
        let imageSrc="/image/"+(i+1)+".png";
        createRanking(topNode,total,i,imageSrc);
    }

    
});


document.getElementById("title").addEventListener("click",function(){
    location.href="/";
});


function createRanking(topNode,total,i,imageSrc){
    let name=total[i].split(",")[0];
    let score=total[i].split(",")[1];
    let secondnode=document.createElement("div");
    secondnode.classList.add("scoreRank");


    let image=document.createElement("img");
    image.src=imageSrc;
    image.classList.add("image");
    image.setAttribute("id","image"+i);
    secondnode.appendChild(image);


    let nameTopDiv=document.createElement("div");
    nameTopDiv.classList.add("nameTop");
    let nameDiv=document.createElement("div");
    nameDiv.classList.add("name");
    nameDiv.innerHTML=name;
    
    let scoreTopDiv=document.createElement("div");
    scoreTopDiv.classList.add("fractionTop");
    let scoreDiv=document.createElement("div");
    scoreDiv.classList.add("fraction");
    scoreDiv.innerHTML=score;
    
    nameTopDiv.appendChild(nameDiv);
    secondnode.appendChild(nameTopDiv);

    scoreTopDiv.appendChild(scoreDiv);
    secondnode.appendChild(scoreTopDiv);
    topNode.appendChild(secondnode);
}


// eslint-disable-next-line no-unused-vars
function back(){
    window.location.href="/";
}