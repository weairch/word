# Word War
#### 可以讓多位使用者開啟分別不同房間聊天交流，也有三種模式可以讓使用者選擇，分別是Single,Score與Buzz模式，希望使用者可以在有趣味性的體驗下，同時增加英文單字能力
<br>

網址 : [wordwar.online](https://wordwar.online "網址:")

- 用有趣的方式練習英文單字
- 可以在對戰室與其他使用者聊天
- 在遊戲中有即時性的體驗



![](https://github.com/weairch/Gif/blob/master/index.gif)

<br>


## 目錄 :


- [Technologies](https://github.com/weairch/word#technologies "Technologies")
- [Architecture](https://github.com/weairch/word#architecture "Architecture")
- [Database Schema](https://github.com/weairch/word#database-schema "Database Schema")
- [Feature](https://github.com/weairch/word#features "Features")
- [Future](https://github.com/weairch/word#future "Future")
- [Author](https://github.com/weairch/word#author "Author")

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
模式說明 : 單純的練習，時間結束後會計算出答題次數與答對幾題。

![](https://github.com/weairch/Gif/blob/master/single.gif)

#### 多人模式 創建房間 選擇 Score 模式
模式說明 : 兩邊在三十秒內答題，上方有時間，自己分數，對方分數，兩邊題目不同，每次答對加一分，當時間歸零，分數最高者獲勝。
![](https://github.com/weairch/Gif/blob/master/score.gif)


#### 多人模式 創建房間 選擇 Buzz 模式
模式說明 : 兩邊題目一樣，在上面會有秒數、自己分數、對方分數，答對則分數加一，獲勝條件為自己或者對方先達到十分，當自己答對，對方畫面則會顯示半透明，並且兩秒後會同時進入下一題，當自己答錯，則要等到對方答題或者完成或者時間歸零，才會進入到下一題。
![](https://github.com/weairch/Gif/blob/master/Buzz.gif)


### Future
歷史功能 : 可以把答錯的題數跟題目放在個人資訊裡面，當使用者想回頭看看答錯什麼題目則可直接到個人頁面尋找，可以直接複習答錯的題目。

### Author

Po Yu Chang [@github.com/weairch](https://github.com/weairch "github.com/weairch")


