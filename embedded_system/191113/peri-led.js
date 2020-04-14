const gpio = require('node-wiring-pi');
const bleno = require('@abandonware/bleno');
const util = require('util');

const LED = 29;
var ledstate = 0;
var nodename = '15team-led';

var PrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;

var SwitchCharacteristic = function(){
    SwitchCharacteristic.super_.call(this, {
        uuid:'ff11',
        properties:['read', 'write'],
        descriptors:[
            new bleno.Descriptor({
                uuid:'2901',
                value:'Switch'
            })
        ]
    });
};

util.inherits(SwitchCharacteristic, Characteristic);

SwitchCharacteristic.prototype.onReadRequest = (offset, callback) => {
    var data = Buffer.alloc(1);
    console.log('READ request');
    data[0] = ledstate;
    callback(this.RESULT_SUCCESS, data);
};

SwitchCharacteristic.prototype.onWriteRequest = (data, offset, withoutResponse, callback) => {
    if(data[0]){
        console.log("블루투스> 데이터수신: " + data.toString('hex') + '(LED ON)');
        gpio.digitalWrite(LED, 1);
        ledstate = 1;
    }
    else{
        ledstate = 0;
        console.log("블루투스> 데이터수신: " + data.toString('hex') + '(LED OFF)');
        gpio.digitalWrite(LED, 0);
    }
    callback(this.RESULT_SUCCESS);
};

var lightService = new PrimaryService({
    uuid:'ff10',
    Characteristic:[
        new SwitchCharacteristic()
    ]
});

bleno.on('stateChange', function(state){
    if(state === 'poweredOn'){
        bleno.startAdvertising(nodename, [lightService.uuid]);
        console.log("---------------------");
        console.log("블루투스> ON (" + nodename + " 가동)");
    }
    else{
        bleno.stopAdvertising();
        console.log("블루투스> Advertising을 중단합니다.");
    }
});

bleno.on('advertisingStart', function(error){
    if(!error){
        console.log("블루투스> Advertising을 시작합니다...");
        console.log("---------------------");
        bleno.setServices([lightService]);
    }
    else{
        console.log("블루투스> Advertising 도중 오류발생");
    }
});

function exit(){
    console.log("블루투스> 프로그램을 종료합니다.");
    process.exit();
}

process.on('SIGINT', exit);
gpio.wiringPiSetup();
gpio.pinMode(LED, gpio.OUTPUT);