var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: /.*eiserne|eiserne hand.*/i,
    location: "linz",
    menu: function(callback) {
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

            callback(result);
        });
    }
}
