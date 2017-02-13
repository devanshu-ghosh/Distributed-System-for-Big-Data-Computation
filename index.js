// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var Queue = require('queuejs');
var crypto = require("crypto"); 
var WQ = new Queue();
var ANS = {};//stores answer mappings. In futute we may implement a DB function here
var DSM = {};//stores the mappings of data sent . If ACK , then remove from object else enqueue in WQ 

var dataAddid = setInterval(addDataToWQ,5000);
//var NACKid = setInterval(checkForNACK,10000);

function addDataToWQ(){
    console.log('Adding Data');
    for(var j=0;j<5;j++){
        var data = {};
        data.id = crypto.randomBytes(16).toString("hex");
        data.data = [];
        for(var i=0;i<10;i++){
            data.data.push(Number(Math.random()*10000000));
        }
        WQ.enq(data);
    }
      
    DSM[data.id]={'num':data.data,'timestamp':new Date()};
    ANS[data.id]=0;
}
function checkForNACK(){
    console.log('checking for NACK');
    var now = new Date();
    //go through DSM to check for NACK 
    for (var key in DSM) {
      if (DSM.hasOwnProperty(key)) {
        if(now - key.timestamp > 500000){
            //we have to calculate the value 500000 
            //we have NACK , reenque the data to WQ 
            var data = {};
            data.id = key;
            data.data = key.num ;
            WQ.enq(data);
        }
    }
  }
}
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));


io.on('connection', function (socket) {
  console.log(socket.id+' connected');
  socket.on('getData',function(){
    if(WQ.isEmpty()===true){
      console.log('Queue Empty');
      socket.emit('Data Queue Empty');
    }
    else{
      var data = WQ.deq(); 
      console.log('data sent');
      socket.emit('takeData',data);
    }
    
  });
  socket.on('result',function(data){
    //ACK 
    console.log('result calculated');
    delete DSM[data.id];//delete that key from DSM 
    ANS[data.id] = data.result;
  });
  socket.on('disconnect', function () {
    console.log(socket.id+' left');
  });
});
