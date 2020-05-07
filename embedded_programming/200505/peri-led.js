const gpio = require('node-wiring-pi');
const bleno = require('@abandonware/bleno')     // peripheral 입장
const util = require('util')

const LED = 29;
var ledstate = 0;
var nodename = 'neogachon1';    // profile명

var PrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;

var SwitchCharacteristic = function() {
    SwitchCharacteristic.super_.call(this, {
        uuid: 'ff11',
        properties: ['read', 'write'],          // properties는 써주기 나름, notify 등 추가 가능
        descriptors: [
            new bleno.Descriptor({
                uuid: '2901',
                value: 'Switch'
            })
        ]
    });
};

util.inherits(SwitchCharacteristic, Characteristic);

// central 기기(ex. 스마트폰)에서 read request를 하면, peripheral에서 이 함수가 실행됨
SwitchCharacteristic.prototype.onReadRequest = (offset, callback) => {
    var data = Buffer.alloc(1);
    data[0] = ledstate;
    console.log("블루투스 > 데이터수신(read 요청): " + data.toString('hex'));
    callback(this.RESULT_SUCCESS, data);            // central 기기로 data 전송
};

// central 기기(ex. 스마트폰)에서 write request를 하면, peripheral에서 이 함수가 실행됨
// BLE를 통해서 한번에 최대 20Bytes까지 수신할 수 있음
SwitchCharacteristic.prototype.onWriteRequest = (data, offset, withoutResponse, callback) => {
    if(data[0]) {       // central에서 온 data[0]가 1인 경우
        console.log("블루투스 > 데이터수신(write 요청): " + data.toString('hex') + " (LED ON)");
        gpio.digitalWrite(LED, 1);
        ledstate = 1;
    }
    else {              // central에서 온 data[0]가 0인 경우
        ledstate = 0;
        console.log("블루투스 > 데이터수신(write 요청): " + data.toString('hex') + " (LED OFF)");
        gpio.digitalWrite(LED, 0);
    }
    callback(this.RESULT_SUCCESS);          // central 기기로 응답(성공) 전송
};

var lightService = new PrimaryService({
    uuid: 'ff10',
    characteristics: [
        new SwitchCharacteristic()
    ]
});

bleno.on('stateChange', function(state) {
    if(state == 'poweredOn') {
        bleno.startAdvertising(nodename, [lightService.uuid]);
        console.log("---------------------------------------");
        console.log("블루투스 > ON (" + nodename + " 가동)");
    }
    else {
        bleno.stopAdvertising();
        console.log("블루투스 > Advertising을 중단합니다.");
    }
});

bleno.on('accept', function(addr) {
    console.log("블루투스 > 상대편(%s)이 연결을 수락했습니다.", addr);
    setInterval(() => { bleno.updateRssi((error, rssi) => {
        console.log("수신감도(5초마다): 2m이내(-20~-50), 3-7m(-60~-80), 8m이상(-90~-120) > " + rssi);
        });
    }, 5000);
});

bleno.on('disconnect', function(addr) {
    console.log("블루투스 > 상대편(%s)이 연결을 끊었습니다.", addr);
});

bleno.on('advertisingStart', function(error) {
    if(!error) {
        console.log("블루투스 > Advertising을 시작합니다...");
        console.log("---------------------------------------");
        bleno.setServices([lightService]);
    }
    else {
        console.log("블루투스 > Advertising 도중 오류 발생");
    }
});

function exit() {
    console.log("블루투스 > 프로그램을 종료합니다.");
    process.exit();
}

process.on('SIGINT', exit);

gpio.wiringPiSetup();
gpio.pinMode(LED, gpio.OUTPUT);