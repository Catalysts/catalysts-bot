"use strict";

var request = require('request');
var cheerio = require('cheerio');
var currentWeekNumber = require('current-week-number');
var PDFParser = require('pdf2json');
var mittag = require('../util/mittagat.js')

module.exports = {
    intent: /.*hartl.*/i,
    location: "linz",
    getMenu: (callback) => menuHartl(callback)
};

function menuHartl(callback) {
    var menu_url = `http://www.hartls-kulinarikum.at/startseite/mittag.html`;
    var base_url = `http://www.hartls-kulinarikum.at/`;

    var result = {
        title: "Hartl",
        url: menu_url,
        menu: "Couldn't find the menu today :("
    };

    var day = new Date().getDay();
    if (day < 1 || day > 4) {
        callback(result);
        return;
    }

    request(menu_url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var re = `"(uploads/media/.*pdf)"`;
            var matches = $(`#container-middle`).toString().match(re);

            var menuFile = matches[1];

            var pdfParser = new PDFParser();

            pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));

            pdfParser.on("pdfParser_dataReady", pdfData => {
                var text = pdfData.formImage.Pages[0].Texts.reduce(function (a, b) {
                    return a + b.R.reduce(function (a, b) {
                        return a + b.T;
                    }, "");
                }, "");
                text = decodeURI(text);

                var results = text.split(/(MONTAG|DIENSTAG|MITTWOCH|DONNERSTAG|FREITAG|ALLE ZUTATEN)/)

                //console.log(results);

                var index = day * 2;
                var menu = results[index].trim();
                menu = decodeURIComponent(menu);
                menu = menu.replace(/:/g, "");
                menu = menu.replace(/€ [0-9]+\,[0-9]+/g, "");

                result.menu = menu;
                callback(result);
            });

            var pdfPipe = request(base_url + menuFile).pipe(pdfParser);
        } else {
            callback(result);
        }
    });

}
