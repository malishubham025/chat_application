const express=require("express");
const app=express();
const http=require("http");
const { connect } = require("http2");
const server=http.createServer(app);
const {Server}=require("socket.io");
const io=new Server(server);
app.set("view engine","ejs");
var id="";
io.on("connection",(socket)=>{
    // console.log("connected",socket.id);
    // id=socket.id;
    console.log("connected",socket.id);
    socket.emit("socketid",socket.id);
    socket.on("message",(message)=>{
        console.log(message);
        io.emit("receivedMessage",message);
        // io.to().emit("receivedMessage",message);
    })
    socket.on("messageto",(message)=>{
        // console.log(message);
        socket.emit("receivedMessage",message.value);
        socket.to(message.to).emit("receivedMessage",message.value);
    })
    socket.on("joinroom",(id)=>{
        console.log("user joinded",id);
        socket.join(id);
    })
    
})
app.get("/",(req,res)=>{
    res.render("index");
})

server.listen(3000,()=>{
    console.log("running ");
})