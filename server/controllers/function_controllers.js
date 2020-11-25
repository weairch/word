const {  selectRandomWord } = require("../models/function_model");
const timeOut = 5;


function randomNumber(req,res){
    let random=selectRandomWord();
    random.then(function(result){
        let {english , chinese , type} =result[0];
        let data = {english,chinese,type,timeOut};
        let final ={data:data};
        res.send(final);
    });
}


module.exports ={
    randomNumber
};