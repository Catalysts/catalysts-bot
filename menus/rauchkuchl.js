"use strict";

var request = require('request');
var cheerio = require('cheerio');
var PDFParser = require('pdf2json');

module.exports = {
    intent: /.*rauch|rauchkuchl|kuchl.*/i,
    location: "linz",
    getMenu: function (callback) {
        var result = {
            title: "Rauchkuchl",
            url: 'https://www.charmanterelefant.at',
            menu: "Couldn't find the menu today :(",
            location: "https://www.google.at/maps/place/Charmanter+Elefant"
        };

        var today = new Date()
        console.log("-----------------")
        var year = today.getFullYear()
        var month = today.getMonth() + 1
        Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(),0,1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
        }



        var day = new Date().getDay();
        var week = today.getWeek();
        var day_of_week = today.getDate();

        //check if the week started in the previous month -> url has to be adjusted
        if (day > day_of_week){
            month = ("0" + (month-1)).slice(-2);
        }

        // result.url = "https://www.charmanterelefant.at/wp-content/uploads/" + year + "/" + month + "/Wochenmen%C3%BC_Elefant_" + week + "_A3.pdf"
        result.url = "https://www.mittag.at/r/rauchkuchl";


        if (day < 1 || day > 5) {
            result.menu = "No menu today.";
            callback(result);
            return;
        }

        request(result.url, function (error, response, html) {
            var day = new Date().getDay();
            if (day < 1 || day > 5) {
                result.menu = "No menu today.";
                callback(result);
                return;
            }
            if (!error) {
                var $ = cheerio.load(html);
                var r = $(`#wrapper > div > div > .current-menu`).html();

                //console.log(typeof(r));
                //console.log(r);
                //console.log("-------------------------");
                try{
                    // r = r.replace("(vegan)", "(vegan... 🤢)");
                    // r = r.replace("2", "\n\n2");
                    // r = r.split("\n")
                    //
                    // r = ["\n\n*Starters*\n\n" + r[1] + "\n\n*Main Course*\n\n" + r[2] + "\n\n*Main Course*\n\n" + r[3]]

                    result.menu = r;
                }
                catch(err){
                    // result.menu = "The friday bug :("
                }
                // console.log(response)
            }
            callback(result);
        });

    }
};
