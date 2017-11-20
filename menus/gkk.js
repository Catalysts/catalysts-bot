var request = require('request');
var cheerio = require('cheerio');
var PDFParser = require('pdf2json');
var builder = require('botbuilder');

module.exports = {

    intent: /.*gkk.*/i,
    location: "linz",
    menu: function(callback) {
        var url = 'http://www.caseli.at/content/download/1363/6617/file/Speiseplan_O%C3%96_GKK_Hauptstelle.pdf'

        var day = new Date().getDay();
        var result = "";

        if (day < 1 || day > 5) {
            result += "No menu today."
            callback(result);
            return;
        }

        var pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));

        pdfParser.on("pdfParser_dataReady", pdfData => {
            //console.log(JSON.stringify(pdfData));
            //console.log(pdfData.formImage.Pages[0].Texts);

            var text = pdfData.formImage.Pages[0].Texts.reduce(function(a, b) {
                return a + b.R.reduce(function(a, b) {
                    return a + b.T;
                }, "");
            }, "");
            text = decodeURI(text);
            //console.log(text);

            var results = text.split(/(MONTAG|DIENSTAG|MITTWOCH|DONNERSTAG|FREITAG)/)

            //console.log(results);
            /*
                 0...empty
                 1...MONTAG
                 2...<monday menu>
                 3...DIENSTAG
                 4...<tuesday menu>
                 5...WEDNESDAY
                 6...<wednesday menu>
                 7...THURSDAY
                 8...<thursday menu>
                 9...FRIDAY
                 10..<friday menu>
                 
                 Monday  -> day==1 --> day+day==2 --> monday menu
                 Tuesday -> day==2 --> day+day==4 --> tuesday menu
                 */
            var index = day * 2;

            //console.log(results[index]);
			//console.log("---------------------------");
            var menu = results[index].trim();
            menu = decodeURIComponent(menu);
            menu = menu.replace(/Classic (I+)/g, "\n\n**Classic $1**\n\n");
            menu = menu.replace("GUSTO", "\n\n**Gusto**\n\n");
            menu = menu.replace("Mehlspeise", "\n\n**Mehlspeise**\n\n");
            menu = menu.replace(/^, /g, "");
            menu = menu.replace("%2C", "");

            //console.log(menu)
            //console.log("---------------------------");
            menu = menu.substring(menu.indexOf("*") + 1);
            menu = menu.replace(/[0-9]+/g, "\n")
            //console.log(menu)
            //console.log("---------------------------");
            result += menu;

            //TODO move template out of code
			var json = {
			        "type": "AdaptiveCard",
			        "version": "1.0",
			        "body": [
			          {
			          	"type": "Container",
			          	"items": [
			          		{
					            "type": "TextBlock",
					            "text": "GKK",
					            "size": "large",
					            "weight": "bolder"
			          		},
			          		{
					            "type": "TextBlock",
					            "wrap": "true",
					            "text": result
			          		}
			          	]
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
        });

        var pdfPipe = request(url).pipe(pdfParser);
    }
}