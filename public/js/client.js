const socket=io();
let room=document.querySelector(".room");
let feed1=document.querySelector(".local");
var admin=false;
let rtcPeerConnection;
let remote=document.querySelector(".remote");
var iceServers={
    iceServers:[
        {urls:"stun:stun.services.mozilla.com"},
        {urls:"stun1:l.google.com.19302"}
    ]
}
function joinroom(){
    // if(room.va)
    if(room.value){
        // alert("hi");
        // socket.join(room.value);
        admin=false;
        socket.emit("join_room",room.value);
        navigator.getUserMedia({
            audio:true,
            video:true
        },function(stream){
            feed1.srcObject=stream;
        },
        function(error) {
            console.error("Error accessing media devices.", error);
        })

    }
    // console.log(room.value);
    // event.preventDefault();
}
function createRoom(){
    
    // socket.emit("join_room",room.value);
    if(room.value){
        admin=true;
        // alert("hi");
        // socket.join(room.value);
        socket.emit("create_room",room.value);
        navigator.getUserMedia({
            audio:true,
            video:true
        },function(stream){
            feed1.srcObject=stream;
        },
        function(error) {
            console.error("Error accessing media devices.", error);
        })
       
    }
    
}
socket.on("ready",function(){
    if(admin){
        rtcPeerConnection=new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate=onicecandidateFunction;
        rtcPeerConnection.ontrack=ontrackFunction;
    }
})
function ontrackFunction(event){
    remote.srcObject=event.streams[0];
}
function onicecandidateFunction(event){
    if(event.candidate){
        let data={
            roomname:room.value,
            candidate:event.candidate
        }
        socket.emit("candidate",data);
    }
}