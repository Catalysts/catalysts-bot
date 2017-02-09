var request = require('request');
var cheerio = require('cheerio');
var mittag = require('./mittagat.js')

module.exports = {
    intent: /.*kraut|kräuterspiele.*/i,
    menu: (callback) => mittag.menu(callback, "krauterspiele" )
}
