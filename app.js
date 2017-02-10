var restify = require('restify');
var builder = require('botbuilder');
var cheerio = require('cheerio');
var request = require('request');

//=========================================================
// Menus
//=========================================================

var hartl = require('./menus/hartl.js');
var kraut = require('./menus/krauterspiele.js');
var rk = require('./menus/rk.js');
var gkk = require('./menus/gkk.js');
var eisernehand = require('./menus/eisernehand.js');
var lackinger = require('./menus/lackinger.js');
var wegschaider = require('./menus/wegschaider.js');

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
// Bots Dialogs
//=========================================================

bot.dialog('/', intents);

intents.matches(rk.intent, [
    function(session) {
        menu.rk(result => session.send(result));
    }
]);

intents.matches(gkk.intent, [
    function(session) {
        gkk.menu(result => session.send(result));
    }
]);

intents.matches(eisernehand.intent, [
    function(session) {
        menu_eisernehand(result => session.send(result));
    }
]);

intents.matches(lackinger.intent, [
    function(session) {
        lackinger.menu(result => session.send(result));
    }
]);

intents.matches(hartl.intent, [
    function(session) {
        hartl.menu(result => session.send(result));
    }
]);

intents.matches(kraut.intent, [
    function(session) {
        kraut.menu(result => session.send(result));
    }
]);

intents.matches(wegschaider.intent, [
    function(session) {
        wegschaider.menu(result => session.send(result));
    }
]);

intents.matches(/.*all.*/i, [
    function(session) {
        eisernehand.menu(result => session.send(result));
        gkk.menu(result => session.send(result));
        rk.menu(result => session.send(result));
        lackinger.menu(result => session.send(result));
        kraut.menu(result => session.send(result));
        hartl.menu(result => session.send(result));
        wegschaider.menu(result => session.send(result));
    }
]);

intents.onDefault([
    function(session, args, next) {
        session.send("Hey, I'm a pretty dumb bot (angel). So far I only understand **RK**, **GKK** and **Eiserne Hand**, **Hartl**, **Kräuterspiele** and **Lackinger**.\n\nTeach me more here: https://github.com/fchtngr/catalysts-lunch-bot; You said: " + session.message.text);
    }
]);
