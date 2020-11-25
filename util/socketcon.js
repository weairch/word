


function socketCon(io){
    let roomno=1;
    // let  clients = 0;
    io.on("connection",function(socket){
        console.log("user connected");
        roomno++;
        socket.join("room-"+roomno);
        // io.sockets.in("room-"+roomno).emit("connectToRoom", "You are in room no. "+roomno);
        socket.on("disconnect",function(){
            console.log("user discommection"); 
            socket.leave("room-"+roomno);
            roomno--;
        });
    });
}


module.exports= {
    socketCon
};