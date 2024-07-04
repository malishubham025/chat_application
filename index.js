const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const http = require("http");

app.set("view engine", "ejs");

// Middleware to serve static files
app.use(express.static(__dirname + '/public'));

// Create HTTP server
const server = http.createServer(app);
const io = new Server(server);

// Socket.io connection
io.on("connection", (socket) => {
    // console.log("connected");
    // console.log(socket.id);
    socket.on("message",(message)=>{
        io.emit("message",message);
        console.log("message received",message);
    })

});

// Route to render index.ejs
app.get("/", (req, res) => {
    res.render("index");
});

// Start the server
server.listen(3000, function() {
    console.log("running ...");
});
