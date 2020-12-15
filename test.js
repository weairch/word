let  aa = setInterval(function(){
    console.log("aa");
},1000);

clearInterval(aa);

let cc;
let bb=setInterval(function(){
    cc = dd();
},3000);

aa=bb;



function dd(){
    let i=0;
    const ee=setInterval(()=>{
        i++;
        console.log("我這裡是dd"+i);
    },5000);
    return ee;
}