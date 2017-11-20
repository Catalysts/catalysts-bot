var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: /.*rk.*/i,
    location: "linz",
    menu: function(callback) {
        var url = 'http://www.mandis-kantine.at/men1908-23082013';

        request(url, function(error, response, html) {
            var result = "";
            if (!error) {
                var day = new Date().getDay();
                var row = day + 4; //thats just how their table is laid out

                var $ = cheerio.load(html);
                var r = $(`#pagetext > table > tbody > tr:nth-child(${row})`).text().replace(/\r\n\s*/g, '\n').trim();
                r = r.substring(r.indexOf(":") + 1);
                r = r.replace(/\(.*\)/g, "\n\n");
                r = r.trim();

                result += r;
            } else {
                result += "Couldn't read todays menu, sorry!"
            }

            //TODO move template out of code
            var json = {
                    "type": "AdaptiveCard",
                    "version": "1.0",
                    "body": [
                      {
                        "type": "TextBlock",
                        "text": "RK",
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
        })
    }
}
