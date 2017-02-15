var request = require('request');
var cheerio = require('cheerio');
var currentWeekNumber = require('current-week-number');
var PDFParser = require('pdf2json');
var mittag = require('../util/mittagat.js')


module.exports = {
    intent: /.*hartl.*/i,
    menu: (callback) => mittag.menu(callback, "hartls-kulinarikum")
    //menu: newHartl
}

function newHartl(callback) {
	var date = new Date();
	var week = currentWeekNumber();
	var url = `http://www.hartls-kulinarikum.at/uploads/media/KULI_WM__KW_${week}_${1900 + date.getYear()}.pdf`

	console.log(url);

}