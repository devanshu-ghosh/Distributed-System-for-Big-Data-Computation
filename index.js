// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var Queue = require('queuejs');
var crypto = require("crypto"); 
var favicon = require("serve-favicon");
var path = require("path");
var generateData = require(path.join(__dirname,'generatePayload'));
var WQ = new Queue();
var ANS = {};//stores answer mappings. In futute we may implement a DB function here
var DSM = {};//stores the mappings of data sent . If ACK , then remove from object else enqueue in WQ 
var addDataCoefficient = 10;//to be changed with request amount
var dataAddid = setInterval(addDataToWQ,5000);
//var NACKid = setInterval(checkForNACK,10000);

function addDataToWQ(){
    console.log('Adding Data');
    for(var j=0;j<addDataCoefficient;j++){
        var payload = generateData(1);
        WQ.enq(payload);
    }    
    DSM[payload.id]={'data':payload.data,'timestamp':new Date()};
    ANS[payload.id]=0;
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

app.use(favicon(path.join(__dirname,'favicon.ico')));
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
      socket.emit('takeData',data);
      console.log('data sent');
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
