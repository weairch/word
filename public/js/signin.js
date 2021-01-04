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