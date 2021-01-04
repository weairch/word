/* eslint-disable no-undef */
document.querySelector(".signup-button").addEventListener("click",async function(event){
    event.preventDefault();
    let name=document.getElementById("signupName").value;
    let password=document.getElementById("signupPw").value;
    let email=document.getElementById("signupEmail").value;
    let data={name,password,email};
    let config={
        method:"POST",
        body:JSON.stringify(data),
        headers:{
            "Content-Type": "application/json"
        }
    };
    let res=await fetch("/api/1.0/signup",config);
    let result=await res.json();
    document.getElementById("signupName").value="";
    document.getElementById("signupPw").value="";
    document.getElementById("signupEmail").value="";
    localStorage.setItem("Authorization",result.token);

    if (result.message =="signup success"){
        Swal.fire(result.message,{
            buttons:{
                OK:true,
            },
        })
            .then(()=>{
                location.href="/";
            });
    }
    else{
        Swal.fire(result.message);
    }

});

document.querySelector(".signin").addEventListener("click",function(){
    window.location.href="/user/signin";
});
document.querySelector(".home").addEventListener("click",function(){
    window.location.href="/";
});