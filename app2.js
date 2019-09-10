const express=require('express');
const app=express()
var bodyParser=require("body-parser");



app.all('/data', (req,res) => {
        
console.log(req.body);
res.send("hey");
})

app.listen(3001,() =>console.log(
    `http://localhost:3001/`
))