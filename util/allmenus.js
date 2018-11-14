"use strict";

var menuReplies = [
    "Roger roger!",
    "Here's whats on the menu today:",
    "Here's what I found:",
    "Hungry yet?",
    "(hungrycat)",
    "Looks like meat is back on the menu boys! Or is it? I'm not smart enough to know that... (smirk). Anyways, here's your menu:"];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
}


function createReply(menu) {
    var r = "\n\n🍽️ **" + menu.title.toUpperCase() + "**\n"
    r += menu.menu;
    return r;
}

function schnitzelDetector(menu) {
    var schnitzeldetected = /schnitz(e|er)?l/gi.test(menu.menu);
    schnitzeldetected &= !(/semme(r)?l/gi.test(menu.menu));

    let schnitzelResult = "";
    if(schnitzeldetected) {
        schnitzelResult =  `\n🚨 Detected Schnitzel Day at **${menu.title}**! (dance)(policecar)`;

        if (!(/wiener/gi.test(menu.menu))) {
            schnitzelResult += " *Be careful, my algorithm has determined that this may be a* **FAKE SCHNITZEL!** (brokenheart)";
        }
        schnitzelResult += "\n";
    }
    return schnitzelResult;
}

module.exports = {
    sendAllMenus: function(session, menus) {
        let ops = [], reply = "", schnitzels = "";
        for (var menu in menus) {
            ops.push(new Promise((resolve, reject) => {
                try {
                    menus[menu].getMenu(result => {
                        schnitzels += schnitzelDetector(result);
                        reply += createReply(result) + "\n";
                        resolve();
                    });
                } catch (e) {
                    console.warn('fetching menu for ' + menu + ' failed: ' + e);
                    resolve();
                }
            }));
        }
        Promise.all(ops).then(() => {
            var message = getRandomElement(menuReplies) + "\n\n";
            message += "----------------------\n\n";
            message += reply;

            if (schnitzels.length > 0) {
                message += "---------------------\n";
                message += schnitzels;
            }
            session.send(message);
        });
    }
}