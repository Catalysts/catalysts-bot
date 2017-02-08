var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: /.*kraut|kräuterspiele.*/i,
    menu: function(callback) {
        var url = 'https://www.mittag.at/r/krauterspiele';

        request(url, function(error, response, html) {
            var result = "**Kräuterspiele**\n\n";
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
