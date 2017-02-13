var socket = io();
var id = setInterval(getData,1000);
function getData(){
    socket.emit('getData');
}
function performComputations(num){
    var sum = 0;
    for(var index = 0;index < num.length ; index++)
        sum+= num[index];
    return sum;
}

socket.on('takeData',function(data){
    var resultData = {};
    resultData.id = data.id;
    resultData.result = performComputations(data.data);
    console.log('Calculate Result for id '+data.id+' is '+resultData.result);
    socket.emit('result',resultData);
});

socket.on('Data Queue Empty',function(){
    console.log('No Data At Server . Sit for a while');
});
function disconnectUser(){
    clearInterval(id);
    socket.close();
    console.log('you have been disconnected');
}