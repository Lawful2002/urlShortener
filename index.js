const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('public', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.listen(3000, ()=>{
    console.log("Sever started at port 3000");
})

app.get("/", (req, res)=>{    
    res.render("home", {page: "Home"});
})