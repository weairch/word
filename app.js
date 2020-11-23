/* eslint-disable linebreak-style */
require('dotenv').config()
const { PORT , API_VERSION} = process.env;
const express = require('express')
const bodyparser = require('body-parser')
const app=express()

app.use(express.static('public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));


// app.use('/api'+API_VERSION,
//     [
        
//     ]
// )

// Error handling
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(500).send('Internal Server Error');
});

app.listen(PORT,function(){
    console.log('listening on port'+PORT)
})