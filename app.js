var restify = require('restify');
var builder = require('botbuilder');
var cheerio = require('cheerio');
var request = require('request');
var PDFParser = require('pdf2json');


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

intents.matches(/^rk/i, [
    function(session) {
        menu_rk(function(result) {
            session.send(result);
        });
    }
]);

intents.matches(/^gkk/i, [
    function(session) {
        menu_gkk(function(result) {
            session.send(result);
        });
    }
]);

intents.matches(/^eiserne hand/i, [
    function(session) {
        menu_eisernehand(function(result) {
            session.send(result);
        });
    }
]);

intents.matches(/^all/i, [
    function(session) {
        //TODO maybe reuse other dialogs 

        menu_eisernehand(function(result) {
            session.send(result);
        });

        menu_gkk(function(result) {
            session.send(result);
        });

        menu_rk(function(result) {
            session.send(result);
        });
    }
]);

intents.onDefault([
    function(session, args, next) {
        session.send("Hey, I'm a pretty dumb bot (angel). So far I only understand **RK**, **GKK** and **Eiserne Hand**.\n\nTeach me more here: https://github.com/fchtngr/catalysts-lunch-bot; You said: " + session.message.text);
    }
]);

//=========================================================

//parse the rk menu
function menu_rk(callback) {
    var url = 'http://www.mandis-kantine.at/men1908-23082013';

    request(url, function(error, response, html) {
        var result = "**RK**\n\n";
        if (!error) {
            var day = new Date().getDay();
            var row = day + 4; //thats just how their table is laid out

            var $ = cheerio.load(html);
            var r = $(`#pagetext > table > tbody > tr:nth-child(${row})`).text().replace(/\r\n\s*/g, '\n').trim();
            result += r;
        } else {
            result += "Couldn't read todays menu, sorry!"
        }
        callback(result)
    })
}

//parse eiserne hand menu
function menu_eisernehand(callback) {
    var url = 'https://manager.yamigoo.com/public/weekly-menu/html/25';

    request(url, function(error, response, html) {
        var result = "**Eiserne Hand**\n\n";
        var day = new Date().getDay();
        if (day < 1 || day > 5) {
            result += "No menu today.";
            callback(result);
            return;
        }

        if (!error) {
            var $ = cheerio.load(html);
            var r = $(`#content > div.row > div > div.weeklymenu > div:nth-child(${day})`).text().replace(/\n\s*/g, '\n').trim();
            result += r;
        }

        callback(result)
    })
}

function menu_gkk(callback) {
    var url = 'http://www.caseli.at/content/download/1363/6617/file/Speiseplan_O%C3%96_GKK_Hauptstelle.pdf'

    var day = new Date().getDay();
    var result = "";

    if (day < 1 || day > 5) {
        result += "No menu today."
        callback(result);
        return;
    }

    var pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));

    pdfParser.on("pdfParser_dataReady", pdfData => {
        //console.log(JSON.stringify(pdfData));
        //console.log(pdfData.formImage.Pages[0].Texts);

        var text = pdfData.formImage.Pages[0].Texts.reduce(function(a, b) {
            return a + b.R.reduce(function(a, b) {
                return a + b.T;
            }, "");
        }, "");
        text = decodeURI(text);
        //console.log(text);

        var results = text.split(/(MONTAG|DIENSTAG|MITTWOCH|DONNERSTAG|FREITAG)/)

        //console.log(results);
        /*
             0...empty
             1...MONTAG
             2...<monday menu>
             3...DIENSTAG
             4...<tuesday menu>
             5...WEDNESDAY
             6...<wednesday menu>
             7...THURSDAY
             8...<thursday menu>
             9...FRIDAY
             10..<friday menu>
             
             Monday  -> day==1 --> day+day==2 --> monday menu
             Tuesday -> day==2 --> day+day==4 --> tuesday menu
             */
        var index = day*2;

        var menu = results[index].trim().replace(/Classic (I+)/g, "\n\nClassic $1\n\n").replace(/^, /g, "").replace("%2C", "");

        //console.log(menu);
        callback("**GKK**\n\n" + menu);
    });

    var pdfPipe = request(url).pipe(pdfParser);
}

function menu_lack(callback) {
    var url = 'http://www.fleischerei-lackinger.at/lackinger/speiseplan/aktuellerspeiseplan';

    request(url, function(error, response, html) {
        if (!error) {
            //TODO
        }
    })
}
