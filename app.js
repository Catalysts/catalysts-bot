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
var menuReplies = [
    "Roger roger!",
    "Here's whats on the menu today:",
    "Here's what I found:",
    "Hungry yet?",
    "(hungrycat)",
    "Looks like meat is back on the menu boys! Or is it? I'm not smart enough to know that... (smirk). Anyways, here's your menu:"];
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
    var name = req.params['name'];
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

function createReply(menu) {
    var r = "\n\n**" + menu.title + "**\n\n"
    r += menu.menu;
    return r;
}

function schnitzelDetector(menu) {
    let schnitzelResult = "";
    if(/schnitz(e|er)?l/gi.test(menu.menu)) {
        schnitzelResult =  `\n**Attention**: Detected Schnitzel Day at ${menu.title}! (dance)`;

        if (!(/wiener/gi.test(menu.menu))) {
            schnitzelResult += " *Be careful, my algorithm has determined that this may be a* **FAKE SCHNITZEL!** (*confidence:high*) (brokenheart)";
        }
    }
    return schnitzelResult;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
}

intents.matches(/.*all.*/i, [
    function (session) {
        let ops = [], reply = "", schnitzels = "";
        for (var menu in menus) {
            ops.push(new Promise((resolve, reject) => {
                menus[menu].getMenu(result => {
                    schnitzels += schnitzelDetector(result);
                    reply += createReply(result) + "\n";
                    resolve();
                })
            }));
        }
        //new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        Promise.all(ops).then(() => {
            var message = getRandomElement(menuReplies) + "\n\n"
            message += "----------------------\n\n";
            message += reply;

            if (schnitzels.length > 0) {
                message += "---------------------\n";
                message += schnitzels;
            }
            session.send(message);
        });
    }
]);

intents.matches(/ping|are you alive/i, [
    function (session) {
        session.send(getRandomElement(aliveReplies))
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