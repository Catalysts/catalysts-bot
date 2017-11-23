var request = require('request');
var cheerio = require('cheerio');

module.exports = {
    intent: /.*eiserne|eiserne hand.*/i,
    location: "linz",
    getMenu: function (callback) {
        var result = {
            title: "Eiserne Hand",
            url: 'https://manager.yamigoo.com/public/weekly-menu/html/25',
            menu: "Couldn't find the menu today :(",
            location: "https://www.google.de/maps/place/Gasthaus+\"Zur+Eisernen+Hand\""
        };

        request(result.url, function (error, response, html) {
            var day = new Date().getDay();
            if (day < 1 || day > 5) {
                result.menu = "No menu today.";
                callback(result);
                return;
            }

            if (!error) {
                var $ = cheerio.load(html);
                var r = $(`#content > div.row > div > div.weeklymenu > div:nth-child(${day})`).text().replace(/\n\s*/g, '\n').trim();
                //console.log(typeof(r));
                //console.log(r);
                //console.log("-------------------------");

                r = decodeURIComponent(r);
                r = r.replace(/Monday|Tuesday|Wednesday|Thursday|Friday/ig, "");
                r = r.replace(/starters/ig, "**Starters**\n\n");
                r = r.replace(/main courses/ig, "");
                r = r.replace(/[0-9]+\) /g, "\n\n**Main Course**\n\n");
                r = r.replace(/EUR [0-9]+\.[0-9]+\n/g, " ");

                result.menu = r;
            }
            callback(result);
        });
    }
};
