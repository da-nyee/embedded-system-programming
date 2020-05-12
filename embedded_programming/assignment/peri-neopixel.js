const gpio = require('node-wiring-pi');
const ws281x = require('@bartando/rpi-ws281x-neopixel');

const bleno = require('@abandonware/bleno');        // peripheral 입장
const util = require('util');

const NUM_LEDS = 12;

ws281x.init({ count: NUM_LEDS, stripType: ws281x.WS2811_STRIP_GRB });
ws281x.setBrightness(10);

const LEDon = (color, max) => {
    for(let i = 0; i < max; i++) {
        ws281x.setPixelColor(i, color);
        ws281x.show();
        gpio.delay(1);
    }
}

var neostate = 0;
var nodename = 'neopractice';                       // profile명

var PrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;

var SwitchCharacteristic = function() {
    SwitchCharacteristic.super_.call(this, {
        uuid: 'ff11',
        properties: ['read', 'write'],
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

    data[0] = neostate;
    console.log("블루투스 > 데이터수신(read 요청): " + data.toString('hex'));
    
    callback(this.RESULT_SUCCESS, data);                // central 기기로 data 전송
};

// central 기기(ex. 스마트폰)에서 write request를 하면, peripheral에서 이 함수가 실행됨
// BLE를 통해서 한번에 최대 20Bytes까지 수신할 수 있음
SwitchCharacteristic.prototype.onWriteRequest = (data, offset, withoutResponse, callback) => {
    if(data[0] == 1) {                                  // central에서 온 data[0]가 1인 경우
        console.log("블루투스 > 데이터수신(write 요청): " + data.toString('hex') + " (RED ON)" + ", " + NEW_NUM_LEDS + "개");

        LEDon({ r:0, g:0, b:0 }, NUM_LEDS);
        LEDon({ r:180, g:0, b:0 }, NEW_NUM_LEDS);       // 빨간색 켜짐
        
        neostate = 1;
    }
    else if(data[0] == 2) {                             // central에서 온 data[0]가 2인 경우
        console.log("블루투스 > 데이터수신(write 요청): " + data.toString('hex') + " (GREEN ON)" + ", " + NEW_NUM_LEDS + "개");

        LEDon({ r:0, g:0, b:0 }, NUM_LEDS);
        LEDon({ r:0, g:180, b:0 }, NEW_NUM_LEDS);       // 초록색 켜짐
        
        neostate = 2;
    }
    else if(data[0] == 3) {                             // central에서 온 data[0]가 3인 경우
        console.log("블루투스 > 데이터수신(write 요청): " + data.toString('hex') + " (BLUE ON)" + ", " + NEW_NUM_LEDS + "개");

        LEDon({ r:0, g:0, b:0 }, NUM_LEDS);
        LEDon({ r:0, g:0, b:180 }, NEW_NUM_LEDS);       // 파란색 켜짐
        
        neostate = 3;
    }
    else {
        console.log("블루투스 > 데이터수신(write 요청): " + data.toString('hex') + " (NeoPixel OFF)");

        LEDon({ r:0, g:0, b:0 }, NUM_LEDS);
        
        neostate = 0;
    }

    callback(this.RESULT_SUCCESS);                      // central 기기로 응답(성공) 전송
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
        console.log("수신감도(3초마다): 2m이내(-20~-50), 3-7m(-60~-80), 8m이상(-90~-120) > " + rssi);

        // 켜야 할 LED 개수 = 총 LED 개수 - ((측정된 수신감도 / (측정수신감도 최솟값 / 총 LED 개수))를 내림한 값)
        NEW_NUM_LEDS = NUM_LEDS - Math.floor(rssi / (-120 / NUM_LEDS));
        });
    }, 3000);
});

bleno.on('disconnect', function(addr) {
    console.log("블루투스 > 상대편(%s)이 연결을 끊었습니다.", addr);

    LEDon({ r:0, g:0, b:0 }, NUM_LEDS);
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
    ws281x.reset();
    process.exit();
}

process.on('SIGINT', exit);

gpio.wiringPiSetup();