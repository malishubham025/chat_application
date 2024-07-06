const express=require("express");
const app=express();
var cookieParser = require('cookie-parser');
const http=require("http");
const bodyParser=require("body-parser");
const { connect } = require("http2");
const server=http.createServer(app);
const {Server}=require("socket.io");
const io=new Server(server);
const cors=require("cors");
const mongoose=require("mongoose");
app.set("view engine","ejs");
app.use(bodyParser.json());
var id="";
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST"],
    credentials:true
}));
mongoose.connect("mongodb://127.0.0.1:27017/chatapp").then(()=>{
    console.log("connected to chatapp");
}).catch((err)=>{
    console.log("error occured !");
    console.log(err);
})
const Schema=new mongoose.Schema({
    username:String,
    password:String
})
const model=mongoose.model("users",Schema);
// io.on("connection",(socket)=>{
//     // console.log("connected",socket.id);
//     // id=socket.id;
//     console.log("connected",socket.id);
//     socket.emit("socketid",socket.id);
//     socket.on("message",(message)=>{
//         console.log(message);
//         io.emit("receivedMessage",message);
//         // io.to().emit("receivedMessage",message);
//     })
//     socket.on("messageto",(message)=>{
//         // console.log(message);
//         socket.emit("receivedMessage",message.value);
//         socket.to(message.to).emit("receivedMessage",message.value);
//     })
//     socket.on("joinroom",(id)=>{
//         console.log("user joinded",id);
//         socket.join(id);
//     })
    
// })
app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/user",(req,res)=>{
    // console.log("users");
    // console.log(req.cookies.user);
    if(req.cookies.user){
        res.status(200).send();
    }
    else{
        res.status(401).send();
    }
    
});

app.post("/login",(req,res) =>{
    // console.log(req.body);
    const u=req.body.username;
    const p=req.body.password;
    console.log(u,p);
    model.find({username:u,password:p}).then((result)=>{
        // console.log(result);
        if(result.length>0){
            res.cookie("user",u);
            console.log("found");
            res.status(200).send();
        }
        else{
            console.log("not found");
            res.status(401).send();
        }
    })
    // res.status(200).send();
})
server.listen(4000,()=>{
    console.log("running ");
})