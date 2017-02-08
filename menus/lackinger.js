var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: /.*lackinger.*/i,
    menu: function(callback) {
        var url = 'https://www.mittag.at/r/lackinger-am-sudbahnhofmarkt';

        request(url, function(error, response, html) {
            var result = "**Lackinger (Südbahnhofmarkt)**\n\n";
            if (!error) {
                var $ = cheerio.load(html);
                var r = $(`#current-menu > div`).text().replace("<br>", "\n")
                result += r;
                callback(result)
            } else {
                callback("Could not read todays menu, sorry :(");
            }
        });
    }

}
