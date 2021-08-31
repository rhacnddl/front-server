const express = require('express');
const path = require('path');

// var isAuthenticated = (request, response, next) => {
//     if(request.isAuthenticated())
//         return next();

//     response.redirect('/login');
// }

function route(basePath) {
    const router = express();

    /* /login */
    router.get('/login', (request, response) => {

        console.log('GET /login');

        response.sendFile(path.join(basePath, '/html/login.html'));
    });

    /* /signup */
    router.get('/signup', (request, response) => {
        
        console.log('GET /signup');

        response.sendFile(path.join(basePath, `/html/signup.html`));
    });

    return router;
}

module.exports = route;