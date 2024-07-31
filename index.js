const express=require("express");
const app=express();
var cookieParser = require('cookie-parser');
const http=require("http");
const bodyParser=require("body-parser");
const server=http.createServer(app);
const {Server}=require("socket.io");
app.use(express.static('public'));
// const {getuser,setuser} =require("./Map");
// const io=new Server(server,{
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });
// const cors=require("cors");
// const mongoose=require("mongoose");
// app.set("view engine","ejs");
// app.use(bodyParser.json());
// var id="";
// app.use(cookieParser());
// app.use(cors({
//     origin:"http://localhost:3000",
//     methods:["GET","POST"],
//     credentials:true
// }));
// mongoose.connect("mongodb://127.0.0.1:27017/chatapp").then(()=>{
//     console.log("connected to chatapp");
// }).catch((err)=>{
//     console.log("error occured !");
//     console.log(err);
// })
// const Schema=new mongoose.Schema({
//     username:String,
//     password:String
// })
// const model=mongoose.model("users",Schema);
// app.get("/",(req,res)=>{
//     res.render("index");
// });
// const cookie = require('cookie');
// io.on("connection", (socket) => {
//     const rawCookies = socket.request.headers.cookie;
//     if (rawCookies) {
//         const parsedCookies = cookie.parse(rawCookies);
//         const username = parsedCookies.user;
//         if (username) {
//             setuser(username, socket.id);
//         }
//     }

//     socket.emit("connectionid", socket.id);

//     socket.on("message", (message) => {
//         const recipientSocketId = getuser(message.user);
//         if (recipientSocketId) {
//             socket.to(recipientSocketId).emit("receivemessage", message.message);
//         }
//     });

//     socket.on("disconnect", () => {
//         // Handle user disconnection if needed
//     });
// });
// app.get("/user",(req,res)=>{
//     // console.log("users");
//     // console.log(req.cookies.user);
//     if(req.cookies.user){
//         res.status(200).send();
//     }
//     else{
//         res.status(401).send();
//     }
    
// });

// app.post("/login",(req,res) =>{
//     // console.log(req.body);
//     const u=req.body.username;
//     const p=req.body.password;
//     console.log(u,p);
//     model.find({username:u,password:p}).then((result)=>{
//         // console.log(result);
//         if(result.length>0){
//             res.cookie("user",u);
//             console.log("found");
//             res.status(200).send();
//         }
//         else{
//             console.log("not found");
//             res.status(401).send();
//         }
//     })
//     // res.status(200).send();
// })
// app.post("/getusers",(req,res)=>{
//     // console.log("hello");
//     // console.log(req.body);
//     model.find({username:{$ne:req.body.user}},{_id:0,username:1}).then((result)=>{
//         // res.result=result;
//         res.status(200).json(result);
//     }).catch((err)=>{
//         res.status(401).send();
//     })
// })
// server.listen(4000,()=>{
//     console.log("running ");
// })
let b=false;
const io=new Server(server);
app.set("view engine","ejs");

io.on("connection",(socket)=>{
    console.log("connected ",socket.id);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
    });
    socket.on("create_room", (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} created  room ${room}`);
    });
    socket.on("ready",function(roomname){
        socket.broadcast.to(roomname).emit("ready");
    })
    socket.on("candidate",function(data){
        socket.broadcast.to(data.roomname).emit("candidate",data.candidate);
    })
    socket.on("offer",function(data){
        socket.broadcast.to(data.roomname).emit("offer",data.offer);
    })
    socket.on("answer",function(data){
        socket.broadcast.to(data.roomname).emit("answer",data.answer);
    })

})
app.get("/",(req,res)=>{
    res.render("index");
})
server.listen(4000,()=>{
    console.log("running ");
})