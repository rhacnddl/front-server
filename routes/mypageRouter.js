const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { json } = require('body-parser');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        const path = getPath();

        if(!fs.existsSync(`upload/${path}`)){
            fs.mkdirSync(`upload/${path}`, {recursive: true});
        }

        callback(null, `upload/${path}`);
    },
    filename: (request, file, callback) => {

        console.log(`pid : `, request.pid);

        callback(null, Date.now() + '_' + file.originalname);
    }
});
const upload = multer({
    storage: storage
});

/* custom func */
function getPath(){
    const date = new Date();    

    const year = date.getFullYear();
    const month = date.getMonth();

    return `${year}/${month + 1}/`;
}

// var isAuthenticated = (request, response, next) => {
//     if(request.isAuthenticated())
//         return next();

//     response.redirect('/login');
// }



function route(basePath) {
    const router = express();

    /* /mypage/info */
    router.get('/info', (request, response) => {

        console.log('GET /mypage/info');

        response.sendFile(path.join(basePath, '/html/mypage/info.html'));
    });

    /* /mypage/upload */
    router.post('/upload', upload.single('file'), (request, response) => {
        console.log('/upload');
        console.log(request.file);
        const arr = request.file.filename.split('_');
        console.log(arr[0]);
        
        return response.json({data: arr[0]});
    });

    return router;
}

module.exports = route;