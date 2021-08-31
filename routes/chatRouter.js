const express = require('express');
const path = require('path');

// var isAuthenticated = (request, response, next) => {
//     if(request.isAuthenticated())
//         return next();

//     response.redirect('/login');
// }

function route(basePath) {
    const router = express();

    /* /chat/rooms */
    router.get('/rooms', (request, response) => {

        console.log('GET /rooms');

        response.sendFile(path.join(basePath, '/html/chat/rooms.html'));
    });

    /* /chat/room */
    router.get('/room', (request, response) => {
        
        console.log('GET /room');

        response.sendFile(path.join(basePath, `/html/chat/room.html`));
    });

    return router;
}

module.exports = route;