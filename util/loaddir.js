var fs = require('fs');
var path = require('path');

//dynamically load all modules
module.exports = {
	requireDir: function (dir) {
		var aret = new Array();
		fs.readdirSync(dir).forEach(function (library) {
			var isLibrary = library.split(".").length > 0 && library.split(".")[1] === 'js' && !library.startsWith("_"),
				libName = library.split(".")[0].toLowerCase();
			if (isLibrary) {
				aret[libName] = require(path.join(dir, library));
			}
		});
		return aret;
	}
}