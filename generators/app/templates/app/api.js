const express = require('express');
const router = express.Router();

const routes = [
    'index'
];

if (routes.length > 0) {
    routes.forEach(function(value, index) {
        var route = require('./' + value + '/' + value + '.routes');
        router.use(route);
    });
}

module.exports = router;