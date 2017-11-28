var request = require('request');
var cheerio = require('cheerio');

module.exports = {
    intent: /.*lackinger.*/i,
    location: "linz",
    getMenu: menuLackinger
}

function menuLackinger(callback) {
    var result = {
        title: "Lackinger",
        url: 'http://www.fleischerei-lackinger.at/speiseplan/',
        menu: "Couldn't find the menu today :("
    };

    var day = new Date().getDay();
    if (day < 1 || day > 4) {
        callback(result);
        return;
    }

    try {
        var plan_url = `http://www.fleischerei-lackinger.at/speiseplan/`;
        request(plan_url, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);
                var elem = $('#diet').find('img[src="http://www.fleischerei-lackinger.at/wp-content/uploads/2017/06/hendlImbiss.jpg"]');
                var menu_url = elem.parent().attr('href');

                request(menu_url, function (error, response, html) {
                    if (!error) {
                        var $ = cheerio.load(html);

                        var menu = $(`.av-catalogue-list > li:nth-child(${day}) > div > div > div:nth-child(2)`).text();//.find(`.av-catalogue-item`).html();
                        menu = decodeURIComponent(menu);
                        //console.log(menu);

                        result.menu = menu;
                    }
                    callback(result);
                });
            }
        });
    } catch (err) {
        callback(result);
    }
}