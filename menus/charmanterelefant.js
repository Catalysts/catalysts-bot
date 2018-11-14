"use strict";

var mittag = require('../util/mittagat.js')

module.exports = {
    intent: /.*charmanter|charmanter elefant|elefant.*/i,
    location: "linz",
    getMenu: (callback) => mittag.menu(callback, "charmanter-elefant")
};
