"use strict";

var restify = require('restify');
var builder = require('botbuilder');
var path = require('path');
var loaddir = require('./util/loaddir.js');
var books = require('./util/books.js');
var isitdown = require('./util/isitdown.js');
var allmenus = require('./util/allmenus.js');

console.log("microsoft_app_id: " + process.env.MICROSOFT_APP_ID);

//=========================================================
// load menus
//=========================================================

var menus = loaddir.requireDir(path.join(__dirname, "menus"));
var aliveReplies = ["I AM ALIVE!", "https://www.youtube.com/watch?v=oQwNN-0AgWc"];

//=========================================================
// Service Setup
//=========================================================

var server = restify.createServer();
server.listen(8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});

//a rest client for alexa to talk to
server.get('/menu/:name', function (req, res, next) {
    var name = req.params.name;
    menus[name].getMenu((result) => res.send(200, result.menu));
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
var createIntent = function (m) {
    intents.matches(m.intent, [
        (session) => m.getMenu(
            (result) => {
                session.send(result.menu);
            }
        )
    ]);
};

for (var menu in menus) {
    createIntent(menus[menu]);
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
}

intents.matches(/.*all.*/i, [
    function (session) {
        allmenus.sendAllMenus(session, menus);
    }
]);

intents.matches(/ping|are you alive/i, [
    function (session) {
        session.send(getRandomElement(aliveReplies))
    }
]);

intents.matches(/is .* down\?*/i, [
	function(session, args) {
		var url = /is (.*) down\?*/gi.exec(session.message.text)[1];
		//console.log(url);
		session.send(isitdown.isitdown(result => session.send(result), url)); 
	}
]);

intents.matches(books.intent, [
    function (session, args, next) {
        session.send("Give me a second to look it up.");
        var isbn = session.message.text.match(/[0-9]+/g)
        //console.log(session.message.text);
        if (isbn.length > 0 || !isbn[isbn.length - 1].trim()) {
            books.query(result => session.send(result), isbn[isbn.length - 1])
        } else {
            session.send("Sorry couldnt find anything. Did you forget the isbn number?");
        }
    }
]);

intents.onDefault([
    function (session, args, next) {

        var commands = "";
        for (var menu in menus) {
            commands += `**${menu}**\n`
        }

        session.send(`Hey, I'm a pretty dumb bot (angel). Here are some commands I understand: \n*all**\n${commands}.`);
    }
]);