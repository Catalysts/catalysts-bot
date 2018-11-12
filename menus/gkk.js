"use strict";

var request = require('request');
var cheerio = require('cheerio');
var PDFParser = require('pdf2json');

module.exports = {

    intent: /.*gkk.*/i,
    location: "linz",
    getMenu: function (callback) {
        var result = {
            title: "GKK",
            url: 'http://www.caseli.at/content/download/1363/6617/file/Speiseplan_O%C3%96_GKK_Hauptstelle.pdf',
            menu: "Couldn't find the menu today :(",
            location: "https://www.google.de/maps/place/O%C3%96GKK+-+Ober%C3%B6sterreichische+Gebietskrankenkasse+Forum+Gesundheit/"
        };

        var day = new Date().getDay();
        if (day < 1 || day > 5) {
            callback(result);
            return;
        }

        var pdfParser = new PDFParser();
        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            //console.log(JSON.stringify(pdfData));
            //console.log(pdfData.formImage.Pages[0].Texts);

            var text = pdfData.formImage.Pages[0].Texts.reduce(function (a, b) {
                return a + b.R.reduce(function (a, b) {
                    return a + b.T;
                }, "");
            }, "");
            text = decodeURI(text);
            //console.log(text);

            var results = text.split(/(MONTAG|DIENSTAG|MITTWOCH|DONNERSTAG|FREITAG)/)

            //console.log(results);
            /*
                 0...empty
                 1...MONTAG
                 2...<monday menu>
                 3...DIENSTAG
                 4...<tuesday menu>
                 5...WEDNESDAY
                 6...<wednesday menu>
                 7...THURSDAY
                 8...<thursday menu>
                 9...FRIDAY
                 10..<friday menu>
                 
                 Monday  -> day==1 --> day+day==2 --> monday menu
                 Tuesday -> day==2 --> day+day==4 --> tuesday menu
                 */
            var index = day * 2;

            var menu = results[index];
            if (!menu) {
                callback(result);
                return;
            }
            menu = menu.trim();
            menu = decodeURIComponent(menu);
            menu = menu.replace(/Classic (I+)/g, "\n\n*Classic $1*\n");
            menu = menu.replace("GUSTO", "\n\n*Gusto*\n");
            menu = menu.replace("Mehlspeise", "\n\n*Mehlspeise*\n");
            menu = menu.replace(/^, /g, "");
            menu = menu.replace("%2C", "");
            menu = menu.substring(menu.indexOf("*") + 1);
            menu = menu.replace(/[0-9]+/g, "\n");

            if (menu.indexOf("Caseli") !== -1) {
                menu = menu.substring(0, menu.indexOf("Caseli") - 1);
            }
            menu = menu.replace("SPEISEPLAN OÖ GK", "");

            result.menu = menu;
            callback(result);
        });

        var pdfPipe = request(result.url).pipe(pdfParser);
    }
};