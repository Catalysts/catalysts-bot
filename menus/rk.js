"use strict";

var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: /.*rk.*/i,
    location: "linz",
    getMenu: function(callback) {
        var result = {
            title: "RK - Mandi's Kantine",
            url: 'http://www.mandis-kantine.at/men1908-23082013',
            menu: "Couldn't find the menu today :(",
            location: "https://www.google.de/maps/place/Austrian+Red+Cross,+regional+Upper+Austria"
        };

        request(result.url, function (error, response, html) {
            if (!error) {
                var day = new Date().getDay();
                var row = day + 4; //thats just how their table is laid out

                var $ = cheerio.load(html);
                var r = $(`#pagetext > table > tbody > tr:nth-child(${row})`).text().replace(/\r\n\s*/g, '\n').trim();
                r = r.substring(r.indexOf(":") + 1);
                r = r.replace(/\(.*\)/g, "\n\n");
                r = r.replace(/\**/g, "");
                r = r.trim();

                result.menu = r;
            }
            callback(result);
        });
    }
};
