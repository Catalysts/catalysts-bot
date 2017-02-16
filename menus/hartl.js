var request = require('request');
var cheerio = require('cheerio');
var currentWeekNumber = require('current-week-number');
var PDFParser = require('pdf2json');
var mittag = require('../util/mittagat.js')


module.exports = {
    intent: /.*hartl.*/i,
    //menu: (callback) => mittag.menu(callback, "hartls-kulinarikum")
    menu: newHartl
}

function newHartl(callback) {
    var date = new Date();
    var week = currentWeekNumber();
    var url = `http://www.hartls-kulinarikum.at/uploads/media/KULI_WM__KW_${week}_${1900 + date.getYear()}.pdf`

    var day = new Date().getDay();
    var result = "**Hartl**\n\n";

    if (day < 1 || day > 4) {
        result += "No menu today."
        callback(result);
        return;
    }

    console.log(url);

    var pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));

    pdfParser.on("pdfParser_dataReady", pdfData => {
        var text = pdfData.formImage.Pages[0].Texts.reduce(function(a, b) {
            return a + b.R.reduce(function(a, b) {
                return a + b.T;
            }, "");
        }, "");
        text = decodeURI(text);

        var results = text.split(/(MONTAG|DIENSTAG|MITTWOCH|DONNERSTAG|FREITAG|ALLE ZUTATEN)/)

        //console.log(results);

        var index = day * 2;

        var menu = results[index].trim().replace("%2C", ",").replace("%3A", "");
        result += menu;
        callback(result);
    });

    var pdfPipe = request(url).pipe(pdfParser);
}
