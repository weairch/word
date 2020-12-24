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
        let imageSrc = "/image/"+(i+1)+".png";
        createRanking(topNode,total,i,imageSrc);
        // if (i == 0){
        //     let imageSrc = "/image/1.png";
        //     createRanking(topNode,total,i,imageSrc);
        // }
        // if (i==1){
        //     let imageSrc="/image/2.png";
        //     createRanking(topNode,total,i,imageSrc);
        // }
        // if (i==2){
        //     let imageSrc="/image/3.png";
        //     createRanking(topNode,total,i,imageSrc);
        // }
        // if (i==3){
        //     let imageSrc="/image/4.png";
        //     createRanking(topNode,total,i,imageSrc);
        // }
        // if (i==3){
        //     let imageSrc="/image/5.png";
        //     createRanking(topNode,total,i,imageSrc);
        // }
        // if (i==3){
        //     let imageSrc="/image/6.png";
        //     createRanking(topNode,total,i,imageSrc);
        // }
        // if (i==3){
        //     let imageSrc="/image/7.png";
        //     createRanking(topNode,total,i,imageSrc);
        // }
        // if (i==3){
        //     let imageSrc="/image/8.png";
        //     createRanking(topNode,total,i,imageSrc);
        // }
        // if (i==3){
        //     let imageSrc="/image/9.png";
        //     createRanking(topNode,total,i,imageSrc);
        // }
        // if (i==3){
        //     let imageSrc="/image/10.png";
        //     createRanking(topNode,total,i,imageSrc);
        // }
    }
});

function createRanking(topNode,total,i,imageSrc){
    let name=total[i].split(",")[0];
    let score=total[i].split(",")[1];
    let secondnode=document.createElement("div");
    secondnode.classList.add("scoreRank");
    //=======================================
    let image=document.createElement("img");
    image.src=imageSrc;
    image.classList.add("image");
    image.setAttribute("id","image"+i);
    // image.src="/image/win.jpg";
    secondnode.appendChild(image);
    //=======================================

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


document.getElementById("title").addEventListener("click",function(){
    location.href="/";
});
