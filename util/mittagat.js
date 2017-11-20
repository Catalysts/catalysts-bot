var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: "",
    menu: function(callback, mittagName) {
        var url = 'https://www.mittag.at/r/' + mittagName;

        request(url, function(error, response, html) {
            var result = "";
            if (!error) {
                var $ = cheerio.load(html);
                var r = $(`#current-menu > div.current-menu`).text().replace("<br>", "\n");
                r = r.replace(/€/g, "");
                r = r.replace(/[0-9]+[\.,][0-9]+/g, "");
                r.trim();
                result += r;

                //TODO move template out of code
                var json = {
                        "type": "AdaptiveCard",
                        "version": "1.0",
                        "body": [
                          {
                            "type": "TextBlock",
                            "text": mittagName,
                            "size": "large",
                            "weight": "bolder"
                          },
                          {
                            "type": "TextBlock",
                            "wrap": "true",
                            "text": result
                          }
                        ],
                        "actions": [
                          {
                            "type": "Action.OpenUrl",
                            "url": url,
                            "title": "See source"
                          }
                        ]
                      }
                callback(json);
            } else {
                callback("Could not read todays menu, sorry :(");
            }
        });
    }

}