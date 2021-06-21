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
    res.render("home", {page: "Home"});
})

app.get("/new", (req, res)=>{
    res.render("create", {page: "Shorten A Link"});
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

app.post("/new", async (req, res) =>{

    const {url} = req.body;

    if(!url){
        res.redirect("/new");
    }

    try {
        const foundLink = await link.findOne({redirectTo: url});

        if(foundLink){
            res.send(foundLink);
        }
        else{
            try{
                const newLink = new link({shortenedLink: nanoid(10), redirectTo: url, dateCreated: new Date()});
                await newLink.save();
                res.redirect("/");
            } catch (e) {res.send(e)}
        }

    } catch (e) {res.send(e)}

})


app.listen(3000, ()=>{
    console.log("Sever started at port 3000");
})
