/* eslint-disable indent */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars


//check user signin or not
let localStorageToken = localStorage.getItem("Authorization"); 
let config = {
    method:"POST",
    headers:{
        Authorization:"Bearer "+localStorageToken,
        "Content-Type": "application/json"
    }
};
fetch("/api/1.0/checkUserToken",config)
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
                location.href="/admin/signin";
            });
            // location.href="/admin/signin";
        }
    })
    .catch(function(err){
        console.log(err);
    });


fetch("/api/1.0/function/serchRoom")
    .then(function(res){
        return res.json();
    })
    .then(function(result){
        let topNode = document.querySelector(".topRoom");
        for (let i=0;Object.keys(result).length>i;i++){

            let room=Object.keys(result)[i];
            let mode=Object.values(result)[i];
            
            let topRoomDiv=document.createElement("div");
            topRoomDiv.classList.add("room");
            
            let roomNumDiv=document.createElement("div");
            let roomModeDiv=document.createElement("div");
            roomNumDiv.classList.add("insideRoom");
            roomNumDiv.setAttribute("id","insideRoom"+i);
            roomModeDiv.classList.add("insideMode");
            roomModeDiv.setAttribute("id","insideMode"+i);
            roomNumDiv.innerHTML="Room: "+room;
            roomModeDiv.innerHTML="Mode: "+mode;

            topRoomDiv.addEventListener("click",async function(){
                let roomText=document.getElementById("insideRoom"+i).textContent;
                let roomNum=roomText.replace("Room: ","");
                
                let modeText=document.getElementById("insideMode"+i).textContent;
                let mode=modeText.replace("Mode: ","");
                
                let data = {mode:mode,room:roomNum};
                let config = {
                    method:"POST",
                    body:JSON.stringify(data),
                    headers:{
                        Authorization:"Bearer "+localStorageToken,
                        "Content-Type": "application/json"
                    }
                };
                await fetch("/api/1.0/sqlAddStandbyRoom",config)
                    .then(function(res){
                        return res.json();
                    })
                    .then(function(token){
                        localStorage.setItem("Authorization",token);
                        location.href="/contest/standby";
                    });

            });


            topRoomDiv.appendChild(roomNumDiv);
            topRoomDiv.appendChild(roomModeDiv);
            topNode.append(topRoomDiv);


        }
    });







document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
});




// eslint-disable-next-line no-unused-vars
async function room(){
    let mode=document.querySelector(".mode").value;
    let roomNum=document.getElementById("room").value;

    if (mode == "null"){
        return Swal.fire("Please select mode!");
    }
    if (mode){
        let data = {mode,roomNum};
        let config = {
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                room:roomNum,
                Authorization:"Bearer "+localStorageToken,
                "Content-Type": "application/json"
            }
        };
        let res=await fetch("/api/1.0/checkStandbyRoomModeAndRoom",config);
        let result=await res.json();
        if (result.message == "This room is a different mode"){
            Swal.fire(result.message,{
                buttons:{
                    OK:true,
                },
            })
            .then(()=>{
                return location.href="/contest/multi";
            });
            // return location.href="/contest/multi";
        }
    }
    if (roomNum){
        let data = {mode:mode,room:roomNum};
        let config = {
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                Authorization:"Bearer "+localStorageToken,
                "Content-Type": "application/json"
            }
        };
        await fetch("/api/1.0/sqlAddStandbyRoom",config)
            .then(function(res){
                return res.json();
            })
            .then(function(token){
                localStorage.setItem("Authorization",token);
                location.href="/contest/standby";
            });
    }
    else{
        Swal.fire("Pleast enter correct room format!");
    }
}

// eslint-disable-next-line no-unused-vars
async function back(){
    window.location.href="/";
}




// eslint-disable-next-line no-undef
const socket = io({
    query: {
        Authorization: localStorage.getItem("Authorization")
    }
});


socket.on("howManyStandbyRoomsNow",function(result){

    let topNode = document.querySelector(".topRoom");
    topNode.innerHTML="";
    
    console.log(result);
    for (let i=0;Object.keys(result).length>i;i++){

        let room=Object.keys(result)[i];
        let mode=Object.values(result)[i];
        
        let topRoomDiv=document.createElement("div");
        topRoomDiv.classList.add("room");
        
        let roomNumDiv=document.createElement("div");
        let roomModeDiv=document.createElement("div");
        roomNumDiv.classList.add("insideRoom");
        roomNumDiv.setAttribute("id","insideRoom"+i);
        roomModeDiv.classList.add("insideMode");
        roomModeDiv.setAttribute("id","insideMode"+i);
        roomNumDiv.innerHTML="Room: "+room;
        roomModeDiv.innerHTML="Mode: "+mode;

        topRoomDiv.addEventListener("click",async function(){
            let roomText=document.getElementById("insideRoom"+i).textContent;
            let roomNum=roomText.replace("Room: ","");
            
            let modeText=document.getElementById("insideMode"+i).textContent;
            let mode=modeText.replace("Mode: ","");
            
            let data = {mode:mode,room:roomNum};
            let config = {
                method:"POST",
                body:JSON.stringify(data),
                headers:{
                    Authorization:"Bearer "+localStorageToken,
                    "Content-Type": "application/json"
                }
            };
            await fetch("/api/1.0/sqlAddStandbyRoom",config)
                .then(function(res){
                    return res.json();
                })
                .then(function(token){
                    localStorage.setItem("Authorization",token);
                    location.href="/contest/standby";
                });

        });


        topRoomDiv.appendChild(roomNumDiv);
        topRoomDiv.appendChild(roomModeDiv);
        topNode.append(topRoomDiv);


    }
});