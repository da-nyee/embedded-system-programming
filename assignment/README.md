## mycontrol.js
### Sensors
- a button, light, touch
### Actuators
- a buzzer, LEDs, a relay
### Development Requirements
1. touch 센서에 터치할 때마다 1색 LED가 0.2초 동안 켜지고 꺼진다.
2. button을 첫번째 누르면 buzzer 소리가 0.1초 동안 나면서 3색 LEDs가 모두 켜진다.
3. button을 두번째 누르면 buzzer 소리가 0.1초 동안 나면서 3색 LEDs가 모두 꺼진다.
4. 3색 LEDs가 모두 켜져있을 때만 light 센서가 빛을 센싱할 수 있다.
5. light 센서에 '밝음→어두움' 변화가 측정되면 relay를 제어하여 전류를 흐르게 한다.
6. light 센서에 '어두움→밝음' 변화가 측정되면 relay를 제어하여 전류를 차단시킨다.
7. 무한반복 실행되며, ctrl+c를 누르면 buzzer, LEDs, relay가 모두 꺼진 후 프로그램이 종료된다.
<br>

## myprg.js
### Sensors
- a touch and light
### Actuators
- a buzzer and LEDs
### Development Requirements
1. touch 센서를 첫번째로 터치하면 buzzer 소리가 0.05초 동안 나면서 3색 LEDs의 청녹색이 켜진다.
2. touch 센서를 두번째로 터치하면 buzzer 소리가 0.08초 동안 나면서 3색 LEDs의 청녹색이 꺼진다.
3. 3색 LEDs의 청녹색이 켜져있을 때만 light 센서가 빛을 측정한다.
4. light 센서에 '밝음→어두움' 변화가 측정되면 3색 LEDs의 빨간색이 켜진다.
5. light 센서에 '어두움→밝음' 변화가 측정되면 3색 LEDs의 빨간색이 꺼진다.
6. touch 센서를 세번째로 터치하면 buzzer 소리가 0.1초 동안 2번(삐, 삐) 나면서 3색 LEDs가 모두 꺼진다.
7. 무한반복 실행되며, ctrl+c를 누르면 buzzer, LEDs가 모두 꺼진 후 프로그램이 종료된다.
<br>

## intpwm.js
### Sensor
- a button
### Actuators
- LEDs and a buzzer
### Development Requirements
1. button은 interrupt 방식으로, 눌렀다 떼는 순간 처리한다.
2. LEDs는 PWM 방식으로, 밝아지는 단계를 1~100 중에서 5단계로 구분한다. (25씩 증가)
3. button을 누를 때마다 LEDs가 점점 밝아진다. (1→25→50→75→100)
4. button을 누를 때마다 LEDs의 색상은 초록→파랑→빨강→하양 순으로 켜진다. 이후에는 다시 처음으로 돌아간다.
5. buzzer는 LEDs의 색상이 바뀌는 시점에 0.05초 동안 짧게 울린다.
6. 무한반복 실행되며, ctrl+c를 누르면 LEDs, buzzer가 모두 꺼진 후 프로그램이 종료된다.
<br>

## ledcontrol.js
### Sensor
- a button
### Actuators
- LEDs and a buzzer
### Development Requirements
1. button을 첫번째로 누르면 파란색 LED가 켜지고 꺼진다.
2. button을 두번째로 누르면 빨간색 LED가 켜지고 꺼진다.
3. button을 세번째로 누르면 초록색 LED가 켜지고 꺼진다.
4. 각 LED가 켜질 때마다 buzzer에서 소리가 난다.
5. 무한반복 실행되며, ctrl+c를 누르면 LEDs, buzzer가 모두 꺼진 후 프로그램이 종료된다.
<br>

## bellcontrol.js
### Sensor
- a button
### Actuators
- LEDs and a buzzer
### Development Requirements
1. button을 3초 미만으로 계속 누르면, 파란색 LED가 0.5초 동안 켜지고 꺼진다.
2. button을 3초 이상으로 계속 누르면, buzzer에서 0.3초 동안 소리가 나고 빨간색 LED가 켜진다.
3. 무한반복 실행되며, ctrl+c를 누르면 LEDs, buzzer가 모두 꺼진 후 프로그램이 종료된다.
<br>

## web_cnt.js, web_ui.html
### Actuators
- a LED, buzzer, and LEDs
### Development Requirements
1. 제시된 사진과 동일한 웹 페이지를 생성한다. (사진 추가)
2. 각 actuator는 ON을 클릭하면 켜지고, OFF를 클릭하면 꺼진다.