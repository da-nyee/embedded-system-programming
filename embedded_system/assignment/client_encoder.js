const request = require('request');
const gpio = require('node-wiring-pi');

const DT = 25;
const CLK = 24;

var rotate = 0;     // 오른쪽으로 돌리면 +1, 왼쪽으로 돌리면 -1

var data = {
    actid:'LED3',
    encode:0
};

const SenseRotate = function(){
    var checked = 0;

    // 왼쪽 핀(DT)가 먼저 접점이 떨어질 경우
    while(gpio.digitalRead(DT) == 0){
        if(checked == 0){
            data.encode = rotate++;
            checked++;
            console.log(rotate);
            
            request.put({
                url:'http://192.9.114.140:60001/rotary',
                form:data,
                headers:{"content-type":"application/x-www-form-urlencoded"}
                },
                function(error, response, body){
                    if(!error && response.statusCode == 200){
                        console.log(body);
                    }
                }
            );
        }
        while(gpio.digitalRead(CLK) == 0){}
    }
    
    while(gpio.digitalRead(CLK) == 0){
        if(checked == 0){
            data.encode = rotate--;
            checked++;
            console.log(rotate);

            request.put({
                url:'http://192.9.114.140:60001/rotary',
                form:data,
                headers:{"content-type":"application/x-www-form-urlencoded"}
                },
                function(error, response, body){
                    if(!error && response.statusCode == 200){
                        console.log(body);
                    }
                }
            );
        }
        while(gpio.digitalRead(DT) == 0){}
    }

    setTimeout(SenseRotate, 20);
}

gpio.wiringPiSetup();
gpio.pinMode(DT, gpio.INPUT);
gpio.pinMode(CLK, gpio.INPUT);
setImmediate(SenseRotate);