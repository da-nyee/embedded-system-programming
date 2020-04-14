const gpio = require('node-wiring-pi');
const mysql = require('mysql');
const TRIG = 29;
const ECHO = 28;

var startTime;  // 초음파 송출시간
var travelTime; // 초음파 수신까지 경과시간

const client = mysql.createConnection({
    host:'localhost',           // DB server IP address
    port:3306,                  // DB server port address
    user:'root',                // DB connection ID
    password:'gachon654321',    // DB connection password
    database:'sensordb'         // DB used
});

const Triggering = function() {
    gpio.digitalWrite(TRIG, gpio.LOW);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(TRIG, gpio.HIGH);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(TRIG, gpio.LOW);

    while(gpio.digitalRead(ECHO) == gpio.LOW);
    startTime = gpio.micros();
    
    while(gpio.digitalRead(ECHO) == gpio.HIGH);
    travelTime = gpio.micros() - startTime;

    distance = travelTime/58;

    if(distance < 400) {
        console.log("Distance: %dcm", distance);

        if(distance <= 20) {    // 20cm 이내 근접거리
            let stamptime = new Date();
            
            client.query('INSERT INTO sonic VALUES (?, ?)', [stamptime, distance], (err, result) => {
                if(err) {
                    console.log("DB 저장실패!");
                    console.log(err);
                }
                else {
                    console.log("DB 저장성공");
                }
            });
        }
    }
    setTimeout(Triggering, 700);
}

const Retrieve = function() {
    let stamp_distance;

    client.query('SELECT * FROM `sonic`', function(error, results, fields) {
        console.log("---------------------------------------");
        results.forEach(function(element, i) {
            stamp_distance = '';
            stamp_distance += element.stamp.toLocaleString('ko-KR', {hour12:false}) + '-';
            stamp_distance += element.stamp.getMilliseconds() + ' ';
            stamp_distance += element.distance;
            console.log(stamp_distance);
        });
        console.log("---------------------------------------");

        setTimeout(Retrieve, 5000); // 5초마다 DB 조회
    });
}

gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
setImmediate(Triggering);
setImmediate(Retrieve);