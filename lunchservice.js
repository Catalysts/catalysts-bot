var restify = require('restify');
var fs = require('fs');
var path = require('path');
var loaddir = require('./util/loaddir.js');

// load menus
var menus = loaddir.requireDir(path.join(__dirname, "menus"));
// start server
var server = restify.createServer();

server.get('/menu/:name', function (req, res, next) {
    var name = req.params['name'];
    menus[name].menu((result) => res.send(200, result));
});

// server.get('/location/:name', function (req, res, next) {
//     var results = [];
//     for (m in menus) {
//         if (menus[m].location === req.params['name']) {
//             console.log(menus[m]);
//             menus[m].menu(r => results.push(r));
//         }
//     }

//     res.send(200, results.toString());
// });

server.listen(8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});