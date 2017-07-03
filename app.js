var restify = require('restify');
var builder = require('botbuilder');
var path = require('path');
var loaddir = require('./util/loaddir.js');
var books = require('./util/books.js');

console.log("microsoft_app_id: " + process.env.MICROSOFT_APP_ID);

//=========================================================
// load menus
//=========================================================

var menus = loaddir.requireDir(path.join(__dirname, "menus"));

//=========================================================
// Service Setup
//=========================================================

var server = restify.createServer();
server.listen(8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});

//a rest client for alexa to talk to
server.get('/menu/:name', function (req, res, next) {
    var name = req.params['name'];
    menus[name].menu((result) => res.send(200, result));
});

//=========================================================
// Bot Setup
//=========================================================

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/bot', connector.listen());

var intents = new builder.IntentDialog();

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', intents);

//create intents for alle menu modules

var createIntent = function(m) {
    intents.matches(m.intent, [
        (session) => m.menu((result) => session.send(result))
    ]);
}

for (var menu in menus) {
    createIntent(menus[menu]);
}

intents.matches(/.*all.*/i, [
    function(session) {
        //send answer for each menu
        for (var menu in menus) {
            menus[menu].menu(result => session.send(result));
        }
    }
]);

intents.matches(/ping|are you alive?/i, [
    function(session) {
        //send answer for each menu
        if (Math.random() > 0.5) {
        	session.send("https://www.youtube.com/watch?v=oQwNN-0AgWc")
        } else {
        	session.send("I AM ALIVE!");	
        }
    }
]);

intents.matches(/.*linz.*/i, [
    function(session) {
        //send answer for each menu
        for (var menu in menus) {
            if (menus[menu].location === "linz") {
                menus[menu].menu(result => session.send(result));
            }
        }
    }
]);

intents.matches(/.*vienna.*/i, [
    function(session) {
        //send answer for each menu
        for (var menu in menus) {
            if (menu.location === "vienna") {
                menus[menu].menu(result => session.send(result));
            }
        }
    }
]);

intents.matches(/.*cluj.*/i, [
    function(session) {
        //send answer for each menu
        for (var menu in menus) {
            if (menus[menu].location === "cluj") {
                menus[menu].menu(result => session.send(result));
            }
        }
    }
]);


intents.matches(books.intent, [
    function(session, args, next) {
        session.send("Give me a second to look it up.");
        var isbn = session.message.text.match(/[0-9]+/g)
        //console.log(session.message.text);
        if (isbn.length > 0 || !isbn[isbn.length-1].trim()) { 
            books.query(result => session.send(result), isbn[isbn.length-1])
        } else {
            session.send("Sorry couldnt find anything. Did you forget the isbn number?");
        }
    }
]);

intents.onDefault([
    function(session, args, next) {

        var commands = "";
        for (var menu in menus) {
            commands += `**${menu}**\n`
        }

        session.send(`Hey, I'm a pretty dumb bot (angel). So far I only understand:\n**all**\n**linz**\n**vienna**\n${commands}.`);
    }
]);