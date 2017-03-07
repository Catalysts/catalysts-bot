var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');
var path = require('path');
var books = require('./util/books.js')

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var intents = new builder.IntentDialog();

//=========================================================
// load menus
//=========================================================

//dynamically load all menu modules in ./menus

var requireDir = function(dir) {
    var aret = new Array();
    fs.readdirSync(dir).forEach(function(library) {
        var isLibrary = library.split(".").length > 0 && library.split(".")[1] === 'js' && !library.startsWith("_"),
            libName = library.split(".")[0].toLowerCase();
        if (isLibrary) {
            var p = path.join(__dirname, dir);
            aret[libName] = require(path.join(p, library));
        }
    });
    return aret;
}

var menus = requireDir("menus");

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

        session.send(`Hey, I'm a pretty dumb bot (angel). So far I only understand: all ${commands}.\n\nTeach me more here: https://github.com/fchtngr/catalysts-lunch-bot`);
    }
]);