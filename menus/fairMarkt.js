module.exports = {

    intent: /.*[Ff]air([-\s]?[Mm]arke?t)?.*/i,
    location: "linz",
    getMenu: function (callback) {
        var result = {
            title: "Fair Markt",
            url: null,
            menu: "Couldn't find the menu today :(",
            location: "https://goo.gl/maps/bMg98D3XbCN2"
        };

        var day = new Date().getDay();
        if (day < 1 || day > 5) {
            callback(result);
            return;
        }

        var menus = {
            "1" : "Most likely: Spagetti Bolognese OR Fleckalspeis OR Resifleisch",
            "2" : "Most likely: Hühnercurry mit Reis from TAMUS SANA",
            "3" : "Most likely: Gemüseeintopf & Brot from TAMUS SANA",
            "4" : "Most likely: Gulash(Rind)         from TAMUS SANA",
            "5" : "Most likely: Geröstete Knödel mit Ei",
        };

        result.menu = menus[day];
        result.menu += " (infos @ 0664-1443675)";

        callback(result);
    }
};