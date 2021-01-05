/* eslint-disable no-undef */

document.querySelector(".login-button").addEventListener("click",async function(event){
    event.preventDefault();
    let password=document.getElementById("signinPw").value;
    let email=document.getElementById("signinEmail").value;
    let data={password,email};
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


function statusChangeCallback(response) {
    console.log("statusChangeCallback");
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === "connected") {
        // Logged into your app and Facebook.
        
        FB.api("/me", function (response) {
            console.log("Successful login for: " + response.name);
            document.getElementById("status").innerHTML =
              "Thanks for logging in, " + response.name + "!";
        });
    } else {
        // The person is not logged into your app or we are unable to tell.
        document.getElementById("status").innerHTML = "Please log " +
          "into this app.";
    }
}