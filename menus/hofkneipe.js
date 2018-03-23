"use strict";

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
    intent: /.*hofkneipe.*/i,
    location: "linz",
    getMenu: function (callback) {
        var result = {
            title: "Hofkneipe",
            url: 'http://hofkneipe.at/mittagsmenue/',
            menu: "Couldn't find the menu today :(",
            location: "https://www.google.de/maps/place/Hofkneipe"
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
                var r = $(`#main > article `).text().replace(/\n\s*/g, '\n').trim().split(/MENÜ/);
                
                r.shift()
                r = r[day]
                
                var suppe=false;
                if (r.includes("Suppe")){
                    suppe=true;
                }
                
                try{
                    r = r.split(".")[2]
                    r = r.split(/Menü|Dessert/)
                    
                    
                    if (suppe){
                        r = ["\n\n*Starters*\n\n" + r[0].split(":")[1] + "\n\n*Main Course*\n\n" + r[1].split(":")[1] + "\n\n*Main Course*\n\n" + r[2].split(":")[1].split("Preis")[0] + "\n\n"]
                    }else{
                        r = ["\n\n*Main Course*\n\n" + r[1].split(":")[1] + "\n\n*Main Course*\n\n" + r[2].split(":")[1] + "\n\n*Desert*\n\n" + r[3].split(":")[1].split("Preis")[0] + "\n\n"]
                    }
                    result.menu = r;
                }
                catch(err){
                    result.menu = "Couldn't parse the menu correctly :("
                }
            }
            callback(result);
        });
    }
};
