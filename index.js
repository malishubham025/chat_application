const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const { Server } = require("socket.io");
const http=require("http");

const server=http.createServer(app);
const io=new Server(server);
io.on("connection",(socket)=>{
    console.log("connected");
    console.log(socket.id);
})
app.get("/",(req,res)=>{
    res.send("hi");
})
app.listen(3000,function(){
    console.log("running ...");
})