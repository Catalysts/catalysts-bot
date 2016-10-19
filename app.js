var restify = require('restify');
var builder = require('botbuilder');
var cheerio = require('cheerio');
var request = require('request');

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
/*bot.dialog('/', function(session) {
    //session.send("Hello World");
    rk(session)
});*/

intents.matches(/^rk/i, [
    function (session) {
        menu_rk(function(result) { 
        	session.send(result); 
        });
    }
]);

intents.matches(/^eiserne hand/i, [
    function (session) {
        menu_eisernehand(function(result) { 
        	session.send(result); 
        });
    }
]);

intents.onDefault([
    function (session, args, next) {
        session.send("I understand: rk, eiserne hand");
    }
]);

//parse the rk menu
function menu_rk(callback) {
    url = 'http://www.mandis-kantine.at/men1908-23082013';

    request(url, function(error, response, html) {
        if (!error) {
            var day = new Date().getDay();
            var row = day + 4; //thats just how their table is laid out
            //console.log("date: " + day + "; row: " + row);

            var $ = cheerio.load(html);
            var result = $(`#pagetext > table > tbody > tr:nth-child(${row})`).text().replace(/\r\n\s*/g, '\n').trim();
            //console.log(result);
            callback(result);
        }
    })
}

//parse eiserne hand menu
function menu_eisernehand(callback) {
    url = 'https://manager.yamigoo.com/public/weekly-menu/html/25';

    request(url, function(error, response, html) {

    	var day = new Date().getDay();
    	if (day < 1 || day > 5) {
    		console.log("no menu today");
    		callback("no menu today");
    		return;
    	} 

        if (!error) {
            var $ = cheerio.load(html);
            var result = $(`#content > div.row > div > div.weeklymenu > div:nth-child(${day})`).text().replace(/\n\s*/g, '\n').trim();
            callback(result);
        }
    })
}
