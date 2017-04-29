var crypto = require("crypto");
var generatePayload = function(functionSignature){
    var payload = {};
    payload.id = crypto.randomBytes(16).toString("hex");
    payload.data = [];
    if(functionSignature == 1){
        //functionSignature == 1 is Array Summation
        var amount = 10;// TO DO , change it to config setting
        for(var i=0;i<amount;i++){
            payload.data.push(Number(Math.random()*10000000));
        }
    }
    return payload;
};

module.exports = generatePayload;