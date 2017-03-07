var request = require('request');
var cheerio = require('cheerio');
var mittag = require('../util/mittagat.js')

module.exports = {
    intent: /.*lackinger.*/i,
    location: "linz",
    menu: (callback) => mittag.menu(callback, "lackinger-am-sudbahnhofmarkt")
}
