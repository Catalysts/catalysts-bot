var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: /.*hartl.*/i,
    menu: function(callback) {
        var url = 'https://www.mittag.at/r/hartls-kulinarikum';

        request(url, function(error, response, html) {
            var result = "**Hartl's Kulinarikum**\n\n";
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
