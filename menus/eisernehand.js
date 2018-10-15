"use strict";

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
    intent: /.*eiserne|eiserne hand.*/i,
    location: "linz",
    getMenu: function (callback) {
        var result = {
            title: "Eiserne Hand",
            url: 'http://gasthaus-eisernehand.at/',
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
                var r = $(`#av_section_2 > div > div > div > div `).text().replace(/\n\s*/g, '\n').trim().split(/Montag|Dienstag|Mittwoch|Donnerstag/);
                var friday = $(`#after_section_2 > div > div > div > div `).text().replace(/\n\s*/g, '\n').trim().split(/Freitag/)[1];
                friday = friday.substr(0,friday.indexOf('Unser'));
                r.push(friday);
                r = r[day];
                
                //console.log(typeof(r));
                //console.log(r);
                //console.log("-------------------------");
                try{
                r = r.replace(/[0-9]+\,[0-9]+\n/g, " ");
                r = r.split("\n")

                r = ["\n\n*Starters*\n\n" + r[1] + "\n\n*Main Course*\n\n" + r[2] + "\n\n*Main Course*\n\n" + r[3]]
                
                result.menu = r;
                }
                catch(err){
                    result.menu = "The friday bug :("
                }
            }
            callback(result);
        });
    }
};
