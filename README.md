# Word War
#### 可以讓多位使用者開啟不同房間聊天交流，也有三種模式可供使用者選擇，分別是 Single,Score 與 Buzz 模式，希望使用者可以在有趣味性的體驗下，同時增加英文單字能力

## 目錄 :

- [Technologies](https://github.com/weairch/word#technologies "Technologies")
- [Architecture](https://github.com/weairch/word#architecture "Architecture")
- [Database Schema](https://github.com/weairch/word#database-schema "Database Schema")
- [Feature](https://github.com/weairch/word#features "Features")
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
![](https://poyu0730.s3-ap-northeast-1.amazonaws.com/%E7%B5%90%E6%A7%8B%E5%9C%962.0.png)

### Database Schema
![](https://poyu0730.s3-ap-northeast-1.amazonaws.com/%E8%B3%87%E6%96%99%E5%BA%AB%E6%9E%B6%E6%A7%8B.jpg)

### Features

#### 單人模式

模式說明 : 左上角為分數，右上角為時間。當點選 Ready 開始之後，畫面中間為題目，每題有四個選項可供點選；答對顯示綠色，答錯顯示淡粉紅色，時間結束後計算出答題次數與答對總題數。

![](https://github.com/weairch/Gif/blob/master/single.gif)

#### 多人模式 創建房間 選擇 Score 模式

模式說明 : 在三十秒內答題，雙方題目不同。上方顯示雙方分數與時間，畫面中間為題目，每題有四個選項可供點選；答對顯示綠色，答錯顯示淡粉紅色，每次答對加一分，當時間歸零，分數最高者獲勝。

![](https://github.com/weairch/Gif/blob/master/score.gif)


#### 多人模式 創建房間 選擇 Buzz 模式

模式說明 : 題目一樣，上方顯示雙方分數與時間。畫面中間為題目，每題有四個選項可供點選；答對顯示綠色，同時對方畫面該選項會變為半透明，且不可點選，並直接進入下一題，而答錯則顯示淡粉紅色，必須等待對方答題或時間歸零，再進入下一道題目，每次答對加一分，當分數達到十分者獲勝。

![](https://github.com/weairch/Gif/blob/master/Buzz.gif)

### Author

Po Yu Chang [@github.com/weairch](https://github.com/weairch "github.com/weairch")


