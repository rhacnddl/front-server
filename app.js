/* Third-party OR Built-in Moduels */
const express = require('express');
const static = require('serve-static');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const path = require('path');
const cors = require('cors');

/* Settings */
const app = express();
const basePath = __dirname;


/* Routers */
const homeRouter = require('./routes/homeRouter.js');
const chatRouter = require('./routes/chatRouter.js');
const mypageRouter = require('./routes/mypageRouter.js');

app.set('port', 3000);
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', static(path.join(__dirname, 'public')));
app.use('/upload', static(path.join(__dirname, 'upload')));

/* Routing */
app.use('/', homeRouter(basePath));
app.use('/chat', chatRouter(basePath));
app.use('/mypage', mypageRouter(basePath));
// app.use('/mypage', mypageRoute());
// app.all('*', (request, response) => {
//     response.status(404).render('404.html');
// });

/* Server */
const server = http.createServer(app).listen(app.get('port'), () => {
    console.log('Express Server is running through PORT : ' + app.get('port'));    
});