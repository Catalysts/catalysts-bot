"use strict";

var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: "",
    menu: function(callback, mittagName) {
        var url = 'https://www.mittag.at/r/' + mittagName;

        request(url, function(error, response, html) {
            var result = {
                title: mittagName,
                url: url,
                menu: "Couldn't find the menu today :("
            };

            if (!error) {
                var $ = cheerio.load(html);
                var r = $(`#current-menu > div.current-menu`).text().replace("<br>", "\n\n");
                r = r.replace(/€/g, "");
                r = r.replace(/[0-9]+[\.,][0-9]+/g, "");
                r.trim();

                result.menu = r;
            }

            callback(result);
        });
    }

}