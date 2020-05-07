const noble = require('@abandonware/noble');

noble.on('stateChange', function(state) {
    if(state == 'poweredOn') { 
        noble.startScanning(['ff10']);
    }
    else {
        noble.stopScanning();
    }
});

noble.on('discover', function(peripheral) {
    if(peripheral.advertisement.localName == 'neogachon1') {
        console.log("블루투스 > 찾았음(discovery) ------------------");
        console.log("블루투스 > 이름: " + peripheral.advertisement.localName);
        console.log("블루투스 > 주소: " + peripheral.address);
        console.log("블루투스 > 신호세기(RSSI): " + peripheral.rssi);
        console.log("-----------------------------------------");
        
        connectAndSetUp(peripheral);
    }
});

function connectAndSetUp(peripheral) {
    peripheral.connect(function(error) {
        let serviceUUIDs = ['ff10'];
        let characteristicUUIDs = ['ff11'];

        peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
    });
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
    if(error) {
        console.log("Error discovering services and characteristics: " + error);
        return;
    }

    var switchCharacteristic = characteristics[0];

    function sendData(byte) {
        let buffer = Buffer.alloc(1);
        buffer[0] = byte;

        console.log("블루투스 > 데이터전송(write): " + byte);

        switchCharacteristic.write(buffer, false, function(error) {
            if(error) {
                console.log(error);
            }
        });
    }

    function remote_led_on() {
        sendData(0x01);
        setTimeout(remote_led_off, 2000);
    }

    function remote_led_off() {
        sendData(0x00);
        setTimeout(remote_led_on, 2000);
    }

    setImmediate(remote_led_on);
}