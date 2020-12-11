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
            alert(result.message);
            location.href="/admin/signin";
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

        //=======這裡可以放個定時讓他跑 並顯示在前端頁面上======
        alert("現在有的房間是"+Object.values(result));
        //====================================================

    });





document.querySelector(".title").addEventListener("click",function(){
    window.location.href="/";
});




// eslint-disable-next-line no-unused-vars
async function room(){
    let mode=document.querySelector(".mode").value;
    let roomNum=document.getElementById("room").value;

    if (mode == "null"){
        return alert("Please select mode!");
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
        if (result.message == "This room is a different model"){
            alert(result.message);
            return location.href="/contest/multi";
        }
    }
    if (roomNum){
        let data = {mode:mode};
        let config = {
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                room:roomNum,
                Authorization:"Bearer "+localStorageToken,
                "Content-Type": "application/json"
            }
        };
        fetch("/api/1.0/sqlAddStandbyRoom",config)
            .then(function(res){
                return res.json();
            })
            .then(function(token){
                localStorage.setItem("Authorization",token);
                location.href="/contest/standby";
            });
    }
    else{
        alert("Pleast enter correct room format!");
    }
}
