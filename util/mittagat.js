"use strict";

var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: "",
    menu: function (callback, mittagName) {
        var url = 'https://www.mittag.at/r/' + mittagName;

        request(url, function (error, response, html) {
            var result = {
                title: mittagName,
                url: url,
                menu: "Couldn't find the menu today :("
            };

            if (!error) {
                var $ = cheerio.load(html);
                var menuElement = $(`#current-menu > div.current-menu`);
                menuElement.find('br').replaceWith('\n');
                var r = menuElement.text();
                r = r.replace("Preis:", "");
                r = r.replace(/€/g, "");
                r = r.replace(/[0-9]+[\.,][0-9]+/g, "");
                r = r.trim();

                result.menu = r;
            }

            callback(result);
        });
    }
}