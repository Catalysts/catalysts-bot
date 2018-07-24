"use strict";

var request = require('request');
var cheerio = require('cheerio');
var PDFParser = require('pdf2json');

module.exports = {
    intent: /.*charmanter|charmanter elefant|elefant.*/i,
    location: "linz",
    getMenu: function (callback) {
        var result = {
            title: "Charmanter Elefant",
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

        result.url = "https://www.mittag.at/r/charmanter-elefant";

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
                var r = $(`#wrapper > div > div > .current-menu`).text();

                //console.log(typeof(r));
                //console.log(r);
                //console.log("-------------------------");
                try{
                    r = r.replace("(vegan)", "(vegan... 🤢)");
                    r = r.replace("2", "\n\n2");
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

        // var pdfParser = new PDFParser();
        // pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
        // pdfParser.on("pdfParser_dataReady", pdfData => {
        //     //console.log(JSON.stringify(pdfData));
        //     //console.log(pdfData.formImage.Pages[0].Texts);
        //     var text = pdfData.formImage.Pages[0].Texts.reduce(function (a, b) {
        //         return a + b.R.reduce(function (a, b) {
        //             return a + b.T;
        //         }, "");
        //     }, "");
        //     text = decodeURI(text);
        //     //console.log(text);
        //     try{
        //         var results = text.split(/(MONTAG|DIENSTAG|MITTWOCH|DONNERSTAG|FREITAG)/)
        //
        //         //console.log(results);
        //         /*
        //              0...empty
        //              1...DONNERSTAG
        //              2...<thursday menu>
        //              3...MONTAG
        //              4...<monday menu>
        //              5...DIENSTAG
        //              6...<tuesday menu>
        //              7...MITTWOCH
        //              8...<wednesday menu>
        //              9...FREITAG
        //              10..<friday menu>
        //
        //              */
        //
        //         var menu = "";
        //         if (day == 1){
        //             var menu = results[4];
        //         }
        //         else if (day == 2) {
        //             var menu = results[6];
        //         }
        //         else if (day == 3){
        //             var menu = results[8];
        //         }
        //         else if (day == 4){
        //             var menu = results[2];
        //         }
        //         else if (day == 5){
        //             var menu = results[10];
        //         }
        //
        //         if (!menu) {
        //             callback(result);
        //             return;
        //         }
        //
        //         menu = menu.trim();
        //         menu = decodeURIComponent(menu);
        //
        //         menu = menu.split("CHEATMEAL: ");
        //         var meal = menu[0].split("€")[0];
        //         var cheatmeal = menu[1].split("€")[0];
        //
        //         menu = "\n\n*Meal:*\n\n" + meal + "\n\n*Cheatmeal:*\n\n" + cheatmeal + "\n\n";
        //
        //         result.menu = menu;
        //         callback(result);
        //     }catch(err){
        //         result.menu = "No cheating today :( go get yourself something healthy!";
        //         callback(result);
        //     }
        // });
        //
        // var pdfPipe = request(result.url).pipe(pdfParser);
        
    }
};
