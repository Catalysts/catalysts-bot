"use strict";

var request = require('request');
var cheerio = require('cheerio');

module.exports = {
    isitdown: function(callback, url) {
		if (!url.startsWith("https://")) 
		{
			url = "https://" + url;
		}
		
		var options = {
			url: url,
			timeout: 2500
		}
		
		//console.log(url)
        request(options, function(error, response, html) {
            var resultstring = "";
			if (error) {
				resultstring += "Seems to be down!\n" + error;
			} else {
				resultstring += "It seems to be up!";
				resultstring += `\n Status code: [${response.statusCode}](https://httpstatuses.com/${response.statusCode})`;
			}
			
			callback(resultstring);
        });
    }
}