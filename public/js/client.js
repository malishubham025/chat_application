const socket=io();
let room=document.querySelector(".room");
let feed1=document.querySelector(".local");
let remote=document.querySelector(".remote");
var admin=false;
let rtcPeerConnection;
let Stream;

const iceServers = {
    iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun1.l.google.com:19302" }
    ]
};


function joinroom(){
    admin=false;
    if (room.value) {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then(function(stream) { // Changed from navigator.getUserMedia to navigator.mediaDevices.getUserMedia and used promises
            Stream = stream; // Ensure Stream is set before emitting ready event
            feed1.srcObject = stream;
            socket.emit("join_room", room.value);
            socket.emit("ready", room.value);
        }).catch(function(error) {
            console.error("Error accessing media devices.", error);
        });
    }

}
function createRoom(){
    admin=true;
    if (room.value) {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then(function(stream) { // Changed from navigator.getUserMedia to navigator.mediaDevices.getUserMedia and used promises
            Stream = stream; // Ensure Stream is set before emitting ready event
            feed1.srcObject = stream;
            socket.emit("create_room", room.value);
            socket.emit("ready", room.value);
        }).catch(function(error) {
            console.error("Error accessing media devices.", error);
        });
    }
}
socket.on("ready",function(){
    // console.log("heelo");
    // rtcPeerConnection=new rtcPeerConnection(iceServers);
    if(admin){
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate=onicecandidateFunction;
    rtcPeerConnection.ontrack=ontrackFunction;
    rtcPeerConnection.addTrack(Stream.getTracks()[0], Stream);
    rtcPeerConnection.addTrack(Stream.getTracks()[1], Stream);
    rtcPeerConnection.createOffer().then((offer)=>{
        // function(offer){
            rtcPeerConnection.setLocalDescription(offer)
            let data={
                roomname:room.value,
                offer:offer
            }
            socket.emit("offer",data);
        // },function(err){
            // console.log(err);
        // }
    })
}
})
socket.on("offer",(offer)=>{
    if(!admin){
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate=onicecandidateFunction;
        rtcPeerConnection.ontrack=ontrackFunction;
        rtcPeerConnection.addTrack(Stream.getTracks()[0], Stream);
        rtcPeerConnection.addTrack(Stream.getTracks()[1], Stream);
        rtcPeerConnection.setRemoteDescription(offer);
        
        rtcPeerConnection.createAnswer().then(function(answer){
            rtcPeerConnection.setLocalDescription(answer);
            let data={
                roomname:room.value,
                answer:answer
            }
            socket.emit("answer",data);
        })
    }
})
socket.on("answer",(answer)=>{
    rtcPeerConnection.setRemoteDescription(answer);
})
socket.on("candidate",(candidate)=>{
    let x=new RTCIceCandidate(candidate);
    rtcPeerConnection.addIceCandidate(x);
})
function onicecandidateFunction(event) {
    if (event.candidate) {
        let data = {
            roomname: room.value,
            candidate: event.candidate
        };
        console.log("Candidate sent: ", data);
        socket.emit("candidate", data);
    }
}
function ontrackFunction(event){
    remote.srcObject=event.streams[0];
}