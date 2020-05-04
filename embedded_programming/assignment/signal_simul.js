const gpio = require("node-wiring-pi");
const fs = require("fs");
const http = require("http");
const socketio = require("socket.io");
const mcpadc = require("mcp-spi-adc");
const ws281x = require("@bartando/rpi-ws281x-neopixel");

const RED = 29;
const GREEN = 28;
const BUTTON = 27;
const BUZZER = 25;

const CS_MCP3208 = 10;
const SPI_SPEED = 1000000;
const LIGHT = 0;
const NUM_LEDS = 12;

var timerid, timeout = 10000;
var lightdata = -1;

ws281x.init({
    count: NUM_LEDS,
    stripType: ws281x.WS2811_STRIP_GRB
});
ws281x.setBrightness(10);

const Light = mcpadc.openMcp3208(
    LIGHT,
    { speedHz: SPI_SPEED },
    (err) => {
        console.log("SPI 채널0 초기화 완료!");
        
        if(err) {
            console.log("SPI 채널0 초기화 실패! (HW 점검!)");
        }
    }
);

const DetectButton = () => {
    gpio.delay(150);

    if(gpio.digitalRead(BUTTON) == 0) {             // 버튼이 눌린 경우
        console.log("Button Pressed!");
        
        GREENon();                                  // 3색 LED 초록색
        
        NeoPixelon({r:180, g:0, b:0}, NUM_LEDS);    // NeoPixel 빨간색
        io.sockets.emit('watch', 1, 0);

        for(let i = 0; i < 6; i++) {                // 부저 0.5초 간격 울림
            BUZZERbutton();
        }
        
        BUZZERoff();                                // 6초 후 부저소리 중지
        REDon();                                    // 3색 LED 빨간색
        
        NeoPixelon({r:0, g:180, b:0}, NUM_LEDS);    // NeoPixel 초록색
        io.sockets.emit('watch', 0, 1);
    }
}

const REDon = () => {
    gpio.digitalWrite(GREEN, 0);
    gpio.digitalWrite(RED, 1);

    DetectButton();                     // 3색 LED가 빨간색인 경우에 한해서 버튼 감지
}

const GREENon = () => {
    gpio.digitalWrite(RED, 0);
    gpio.digitalWrite(GREEN, 1);
}

const BUZZERon = () => {
    gpio.digitalWrite(BUZZER, 1);
}

const BUZZERoff = () => {
    gpio.digitalWrite(BUZZER, 0);
}

const BUZZERlight = () => {
    BUZZERon();
    gpio.delay(1000);
    BUZZERoff();
    gpio.delay(1000);
}

const BUZZERbutton = () => {
    BUZZERon();
    gpio.delay(500);
    BUZZERoff();
    gpio.delay(500);
}

const DARK = () => {
    NeoPixelon({r:0, g:180, b:0}, NUM_LEDS);    // NeoPixel 초록색
    io.sockets.emit('watch', 0, 1);

    REDon();                                    // 3색 LED 빨간색
    BUZZERoff();                                // 부저소리 안 남
}

const BRIGHT = () => {
    NeoPixelon({r:180, g:0, b:0}, NUM_LEDS);    // NeoPixel 빨간색
    io.sockets.emit('watch', 1, 0);

    GREENon();                                  // 3색 LED 초록색
    
    for(let i = 0; i < 2; i++) {            // 부저 1초 간격 울림
        BUZZERlight();
    }
    BUZZERon();
    gpio.delay(1000);
    BUZZERoff();
}

const SignalControl = () => {
    Light.read((error, reading) => {
        console.log("▲ ▼ (%d)", reading.rawValue);
        lightdata = reading.rawValue;
    });

    if(lightdata != -1) {
        // 어두운 경우
        if(lightdata > 2200) {
            setTimeout(DARK, 5000);
        }
        // 밝은 경우
        else {
            setTimeout(BRIGHT, 5000);
        }

        timerid = setTimeout(SignalControl, timeout);
    }
}

process.on('SIGINT', () => {
    Light.close(() => {
        console.log("MCP-ADC가 해제되어 웹서버를 종료합니다.");

        gpio.digitalWrite(RED, 0);
        gpio.digitalWrite(GREEN, 0);
        gpio.digitalWrite(BUZZER, 0);
        ws281x.reset();
        
        process.exit();
    });
});

// 웹 브라우저 접속
const serverbody = (request, response) => {
    fs.readFile("./views/plotly_signal_simul.html", "utf8", (err, data) => {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(data);
    });
};

const NeoPixelon = (color, max) => {
    for(let i = 0; i < max; i++) {
        ws281x.setPixelColor(i, color);
        ws281x.show();
        gpio.delay(1);
    }
}

const server = http.createServer(serverbody);
const io = socketio.listen(server);

io.sockets.on("connection", (socket) => {
    socket.on("startmsg", () => {
        console.log("가동메세지 수신!");

        SignalControl();
    });

    socket.on("stopmsg", () => {
        console.log("중지메세지 수신!");

        clearTimeout(timerid);
    });
});

server.listen(65001, () => {
    gpio.wiringPiSetup();

    gpio.pinMode(RED, gpio.OUTPUT);
    gpio.pinMode(GREEN, gpio.OUTPUT);
    gpio.pinMode(BUTTON, gpio.INPUT);
    gpio.pinMode(BUZZER, gpio.OUTPUT);
    gpio.pinMode(CS_MCP3208, gpio.OUTPUT);

    gpio.wiringPiISR(BUTTON, gpio.INT_EDGE_FALLING, SignalControl);

    console.log("--------------------------------------");
    console.log("길거리 보행 신호등 제어 웹서버");
    console.log("웹브라우저 접속주소: http://192.168.35.24:65001/");
    console.log("--------------------------------------");
});