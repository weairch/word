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
function room(){
    let roomNum=document.getElementById("room").value;
    if (roomNum){
        let config = {
            method:"POST",
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
