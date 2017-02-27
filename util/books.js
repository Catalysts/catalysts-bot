var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    intent: /.*book.*/i,
    query: function(callback, isbn) {
        //console.log(isbn);

        var url = 'https://www.goodreads.com/search?q=';
        var caturl = 'https://www.goodreads.com/review/list/41937025-catalysts?utf8=%E2%9C%93&search%5Bquery%5D='
        var reviewurl = 'https://www.goodreads.com/review/show/'

        request(url + isbn, function(error, response, html) {
            var errorCallback = () => callback(`Nope it looks like we dont have that book (${isbn}).`);
            if (error) {
                errorCallback();
                return;
            }

            var $ = cheerio.load(html);
            var title = $(`#bookTitle`).text().trim()

            if (!title) {
                errorCallback();
                return;
            }

            request(caturl + title, function(error, response, html) {
                if (error) {
                    errorCallback();
                    return;
                }
                var $ = cheerio.load(html);
                var body = $('#booksBody')

                var rows = body.find('tr');
                if (rows.length > 0) {
                    var reviewId = rows[0].attribs.id.replace("review_", "");
                    //console.log(reviewId);
                    callback(`**Yes!** Looks like we have the book *${title}*. See more info here: ${reviewurl + reviewId}`);
                }

            });
        });
    }

}
