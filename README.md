# Word War
#### 具備多種模式，可讓多位玩家在多重獨立空間下競爭的英文練習網站
<br>

網址 : [wordwar.online](https://wordwar.online "網址:")

- 用有趣的方式練習英文單字
- 可以在對戰室與其他使用者聊天
- 在遊戲中有即時性的體驗



![](https://poyu0730.s3-ap-northeast-1.amazonaws.com/4EQLE06wlu.gif)

<br>


## 目錄 :


- Technologies
- Architecture
- Database Schema
- Features
- Author

## Technologies
### Backend
 - Node.js
 - Express.js
 - Linux
 - RESTful API
 - NGINX
 - PM2

### Frontend
 - HTML
 - CSS
 - JavaScript
 - AJAX
 - Bootstrap

### Database
 - MySQL

### Cloud Service
 - Elastic Compute Cloud (EC2)
 - Relational Database Service (RDS)

### Web Socket
 - Socket.IO

### Networking
 - HTTP & HTTPS
 - SSL Certificate 
 - Domain Name System (DNS)

### Test
- Mocha
- chai
- Artillery

### Others
 - Design Pattern: MVC
 - Version Control: Git, GitHub

### Architecture
![](https://poyu0730.s3-ap-northeast-1.amazonaws.com/%E7%B5%90%E6%A7%8B%E5%9C%96.png)

### Database Schema
![](https://poyu0730.s3-ap-northeast-1.amazonaws.com/%E8%B3%87%E6%96%99%E5%BA%AB%E6%9E%B6%E6%A7%8B.jpg)


### Features

測試帳號:
- 電子信箱 : test1@hotmail.com
- 密碼 : test1
<br>
- 電子信箱 : test2@hotmail.com
- 密碼 : test2

<br>

#### 單人模式
模式說明 : 單純的練習，最後會計算出答題次數跟答對幾題

![](https://github.com/weairch/Gif/blob/master/single.gif)

#### 多人模式 創建房間 選擇 Score 模式
模式說明 : 兩邊在三十秒內答題，答對最多的獲勝，對方分數會顯示在右上角
![](https://github.com/weairch/Gif/blob/master/score.gif)


#### 多人模式 創建房間 選擇 Buzz 模式
模式說明 : 兩邊同時答同一題，當答錯了另外一邊會顯示為半透明狀，時間到或者雙方答錯則會同時進入下一題，當答對了自己會顯示綠色，對方畫面上也會顯示半透明，過兩秒後則同時進入下一題
![](https://github.com/weairch/Gif/blob/master/Buzz.gif)


### Author

Po Yu Chang [@github.com/weairch](https://github.com/weairch "github.com/weairch")


