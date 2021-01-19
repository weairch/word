/* eslint-disable no-undef */
document.getElementById("title").addEventListener("click",function(){
    location.href="/";
});
// eslint-disable-next-line no-unused-vars
function back(){
    window.location.href="/";
}

// eslint-disable-next-line no-unused-vars
function signOut(){
    localStorage.removeItem("Authorization");
    Swal.fire("Sign out success !",{
        buttons:{
            OK:true,
        },
    })
        .then(()=>{
            location.href="/";
        });
}


const user=async function(){
    let token=localStorage.getItem("Authorization");
    let config={
        method:"POST",
        headers:{
            Authorization:"Bearer "+token,
            "Content-Type": "application/json"
        }
    };
    
    let res=await fetch("/api/1.0/checkUserToken",config);
    let result=await res.json();
    return result;
};



user().then(async function(result){
    if (result.Token == undefined){
        Swal.fire(
            result.message,{
                buttons:{
                    OK:true,
                },
            })
            .then(()=>{
                window.location.href="/user/signin";
            });
    }
    let {name ,id}=result;
    document.querySelector(".name").innerHTML="Hello "+name+" ! Let’s see your record !";
    

    let config={
        method:"GET",
        headers:{
            id:id,
            "Content-Type": "application/json"
        }
    };
    let res=await fetch("/api/1.0/getProfileWinRat",config);
    let winRat=await res.json();

    let topNode=document.getElementById("session");
    topNode.innerHTML="";
    
    //==================title====================
    let secondnode=document.createElement("div");
    secondnode.classList.add("modeTitle");

    let modeDiv=document.createElement("div");
    modeDiv.classList.add("Mode");
    modeDiv.innerHTML="Mode";
    
    let totalWinDiv=document.createElement("div");
    totalWinDiv.classList.add("totalWinDiv");
    totalWinDiv.innerHTML="Total win";

    let playTimesDiv=document.createElement("div");
    playTimesDiv.classList.add("playTimes");
    playTimesDiv.innerHTML="Play times";

    let winRatDiv=document.createElement("div");
    winRatDiv.classList.add("winRat");
    winRatDiv.innerHTML="Win rate";




    //===========score mode==========================
    let thirdNode=document.createElement("div");
    thirdNode.classList.add("scoreMode");

    let scoreDiv=document.createElement("div");
    scoreDiv.classList.add("score");
    scoreDiv.innerHTML="Score";

    
    let scoreTotalWinDiv=document.createElement("div");
    scoreTotalWinDiv.classList.add("scoreTotalWin");
    scoreTotalWinDiv.innerHTML=winRat.score.scoreTotalWin;
    
    let topScoreTotalWinDiv=document.createElement("div");
    topScoreTotalWinDiv.classList.add("topScoreTotalWin");
    topScoreTotalWinDiv.appendChild(scoreTotalWinDiv);

    
    let scorePlayTimesDiv=document.createElement("div");
    scorePlayTimesDiv.classList.add("scorePlayTimes");
    scorePlayTimesDiv.innerHTML=winRat.score.scorePlayTimesTotla;


    let topScorePlayTimesDiv=document.createElement("div");
    topScorePlayTimesDiv.classList.add("topScorePlayTimes");
    topScorePlayTimesDiv.appendChild(scorePlayTimesDiv);

    let scoreWinRatNumber;
    let winrat=(winRat.score.scoreTotalWin/winRat.score.scorePlayTimesTotla)*100;
    if (winrat == 0){
        scoreWinRatNumber=0;
    }
    else if (isNaN(winrat)){
        scoreWinRatNumber=0;
    }
    else{
        scoreWinRatNumber=winrat.toFixed(2);
    }


    let scoreWinRatDiv=document.createElement("div");
    scoreWinRatDiv.classList.add("scoreWinRat");
    scoreWinRatDiv.innerHTML=scoreWinRatNumber+"%";

    let topScoreWinRatDiv=document.createElement("div");
    topScoreWinRatDiv.classList.add("topScoreWinRat");
    topScoreWinRatDiv.appendChild(scoreWinRatDiv);

    //buzz mode

    let fourNode=document.createElement("div");
    fourNode.classList.add("buzzMode");

    let buzzDiv=document.createElement("div");
    buzzDiv.classList.add("buzz");
    buzzDiv.innerHTML="Buzz";

    let buzzTotalWinDiv=document.createElement("div");
    buzzTotalWinDiv.classList.add("buzzTotalWin");
    buzzTotalWinDiv.innerHTML=winRat.buzz.buzzTotalWin;

    let topBuzzTotalWinDiv=document.createElement("div");
    topBuzzTotalWinDiv.classList.add("topBuzzTotalWin");
    topBuzzTotalWinDiv.appendChild(buzzTotalWinDiv);

    let buzzPlayTimesDiv=document.createElement("div");
    buzzPlayTimesDiv.classList.add("buzzPlayTimes");
    buzzPlayTimesDiv.innerHTML=winRat.buzz.buzzPlayTimesTotla;
    
    let topBuzzPlayTimesDiv=document.createElement("div");
    topBuzzPlayTimesDiv.classList.add("topBuzzPlayTimes");
    topBuzzPlayTimesDiv.appendChild(buzzPlayTimesDiv);

    let buzzWinRatNumber;
    let buzzWinrat=(winRat.buzz.buzzTotalWin/winRat.buzz.buzzPlayTimesTotla)*100;
    if (buzzWinrat == 0){
        buzzWinRatNumber=0;
    }
    else if (isNaN(buzzWinrat)){
        buzzWinRatNumber=0;
    }
    else{
        console.log("here is else");
        buzzWinRatNumber=buzzWinrat.toFixed(2);
    }

    let buzzWinRatDiv=document.createElement("div");
    buzzWinRatDiv.classList.add("buzzWinRat");
    buzzWinRatDiv.innerHTML=buzzWinRatNumber+"%";

    let topBuzzWinRatDiv=document.createElement("div");
    topBuzzWinRatDiv.classList.add("topBuzzWinRat");
    topBuzzWinRatDiv.appendChild(buzzWinRatDiv);


    secondnode.appendChild(modeDiv);
    secondnode.appendChild(totalWinDiv);
    secondnode.appendChild(playTimesDiv);
    secondnode.appendChild(winRatDiv);
    topNode.appendChild(secondnode);

    thirdNode.appendChild(scoreDiv);
    thirdNode.appendChild(topScoreTotalWinDiv);
    thirdNode.appendChild(topScorePlayTimesDiv);
    thirdNode.appendChild(topScoreWinRatDiv);

    fourNode.appendChild(buzzDiv);
    fourNode.appendChild(topBuzzTotalWinDiv);
    fourNode.appendChild(topBuzzPlayTimesDiv);
    fourNode.appendChild(topBuzzWinRatDiv);

    topNode.appendChild(thirdNode);
    topNode.appendChild(fourNode);
});