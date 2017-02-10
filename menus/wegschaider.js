var request = require('request');
var cheerio = require('cheerio');
var mittag = require('./mittagat.js');

module.exports = {
    intent: /.*wegschaider.*/i,
    menu: (callback) => mittag.menu(callback, "wegschaider-sudbahnhof-markt")
}
