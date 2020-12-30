
document.querySelector(".signin").addEventListener("click",function(){
    window.location.href="/user/signin";
});
document.querySelector(".Single-player-mode").addEventListener("click",function(){
    window.location.href="/contest/single";
});
document.querySelector(".Battle-mode").addEventListener("click",function(){
    window.location.href="/contest/multi";
});
document.querySelector(".Query-ranking").addEventListener("click",function(){
    window.location.href="/function/ranking";
});

let token = localStorage.getItem("Authorization");
if (token){
    let config = {
        method:"POST",
        headers:{
            Authorization:"Bearer "+token,
            "Content-Type": "application/json"
        }
    };
    fetch("/api/1.0/checkUserToken",config)
        .then(function(res){
            return res.json();
        })
        .then(function(result){
            let message = result.Token;
            if (message == "user is OK , aleard signin"){
                let btn=document.getElementById("signin");
                btn.innerHTML="Profile";
                btn.addEventListener("click",function(){
                    window.location.href="/user/profile";
                });
            }
        })
        .catch(function(err){
            console.log(err);
        });
}