var request = require('request');
var cheerio = require('cheerio');
var mittag = require('./mittagat.js');

module.exports = {
    intent: /.*hartl.*/i,
    menu: (callback) => mittag.menu(callback, "hartls-kulinarikum")
}
