function random(min,max){
    let choices = max - min + 1;
    let num = Math.floor(Math.random() * choices + min );
    return num;
}

module.exports={
    random
}