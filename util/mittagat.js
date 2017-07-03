var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: "",
    menu: function(callback, mittagName) {
        var url = 'https://www.mittag.at/r/' + mittagName;

        request(url, function(error, response, html) {
            var result = `**${mittagName}**\n\n`;
            if (!error) {
                var $ = cheerio.load(html);
                var r = $(`#current-menu > div.current-menu`).text().replace("<br>", "\n")
                result += r;
                callback(result)
            } else {
                callback("Could not read todays menu, sorry :(");
            }
        });
    }

}