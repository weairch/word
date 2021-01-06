/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

document.querySelector(".login-button").addEventListener("click",async function(event){
    event.preventDefault();
    let password=document.getElementById("signinPw").value;
    let email=document.getElementById("signinEmail").value;
    let data={password,email,loginMethod:"native"};
    let config={
        method:"POST",
        body:JSON.stringify(data),
        headers:{
            "Content-Type": "application/json"
        }};
    let res=await fetch("/api/1.0/signin",config);
    let result=await res.json();
    if (result.message =="Signin success"){
        localStorage.setItem("Authorization",result.token);
        Swal.fire("Signin success",{
            buttons:{
                OK:true,
            },
        }).then(()=>{
            location.href="/";
        });
    }
    else{
        document.getElementById("signinPw").value="";
        document.getElementById("signinEmail").value="";
        Swal.fire(result.message);
    }
});

document.querySelector(".sign-up").addEventListener("click",function(){
    window.location.href="/user/signup";
});
document.querySelector(".home").addEventListener("click",function(){
    window.location.href="/";
});



window.fbAsyncInit = function() {
    FB.init({
        appId      : "1047523419047255",
        cookie     : true,
        xfbml      : true,
        version    : "v9.0"
    });
      
    FB.AppEvents.logPageView();    
};



(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, "script", "facebook-jssdk"));

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

async function statusChangeCallback(response) {  
    console.log("statusChangeCallback");
    console.log(response);                   
    if (response.status === "connected") {   
        let accessToken = response.authResponse.accessToken;
        let data={accessToken,loginMethod:"facebook"};
        let config={
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "Content-Type": "application/json"
            }};
        let res=await fetch("/api/1.0/signin",config);
        let result=await res.json();
        console.log(result);
    } else {                                 
        //
    }
}