var request = require('request');
var cheerio = require('cheerio');
var mittag = require('../util/mittagat.js')

module.exports = {
    intent: /.*lackinger.*/i,
    location: "linz",
    //menu: (callback) => mittag.menu(callback, "lackinger-am-sudbahnhofmarkt")
    menu: menuLackinger
}

function menuLackinger(callback) {
    var notFoundMsg = "Sorry, I didn't find today's menu.\nHave a look yourself: http://www.fleischerei-lackinger.at/speiseplan/"
    var plan_url = `http://www.fleischerei-lackinger.at/speiseplan/`;

    //seems to be constant for now
    var entry_id = '.post-entry-999';

    var result = "**Lackinger**\n\n";
    var day = new Date().getDay();

    if (day < 1 || day > 4) {
        result += "No menu today.";
        callback(result);
        return;
    }

    try {
        request(plan_url, function (error, response, html) {

            if (!error) {
                var $ = cheerio.load(html);

                //looking for a fixed id of "Hendlimbiss",
                // could be replaced by searching for image with "hendlimbiss" in the filename
                try {
                    var menu_url = $($('#diet').find(entry_id)[0].children[0]).attr('href');


                    request(menu_url, function (error, response, html) {

                        if (!error) {
                            var $ = cheerio.load(html);

                            try {
                                var price = `\n` + $('.av-catalogue-list').find('.av-catalogue-item')[day - 1].children[0].children[0]
                                    .children[1].children[0].data;
                                var food = $('.av-catalogue-list').find('.av-catalogue-item')[day - 1].children[0].children[1]
                                    .children[0].data;
                                result += food + price;
                                callback(result);

                            } catch (err) {
                                callback(notFoundMsg);
                            }
                        } else {
                            callback(notFoundMsg);
                        }
                    });
                } catch (err) {
                    callback(notFoundMsg);
                }
            }
        });
    } catch (err) {
        callback(notFoundMsg);
    }

}