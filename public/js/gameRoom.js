
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
