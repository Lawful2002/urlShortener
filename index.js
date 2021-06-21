const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { nanoid } = require('nanoid')
const link = require("./models/links");
const engine = require('ejs-mate');

const app = express();
mongoose.connect('mongodb://localhost:27017/shortenedLinks', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log("db connection success"))
    .catch(() => console.log(" db connection error"))


app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))


app.get("/", (req, res)=>{    
    res.render("home");
})

app.get("/user/", (req, res)=>{
    const {user} = req.query;     
    res.redirect(`/user/${user}`);
})

app.get("/user/:user", async (req, res)=>{

    const {user} = req.params;

    try{
        const data = await link.find({username: user});
        console.log(data);
        res.render("user", {data, user});
    }
    catch(e){
        res.send(e);
    }
})

app.get("/:id", async (req, res)=>{
    const {id} = req.params;
    const goto = await link.findOne({shortenedLink: id});

    if(!goto){
        res.send("Page not Found");
    }
    else{
        res.redirect(goto.redirectTo);
    }

})

app.post("/", async (req, res) =>{

    const {url, username} = req.body;
    res.locals.query = {user: username}

    if(!url){
        res.redirect("/");
    }
    try{
        const newLink = new link({shortenedLink: nanoid(10), redirectTo: url, dateCreated: new Date(), username: username});
        await newLink.save();
        res.redirect(`/user/${username}`);
    } catch (e) {res.send(e)}
    
})


app.listen(3000, ()=>{
    console.log("Sever started at port 3000");
})
