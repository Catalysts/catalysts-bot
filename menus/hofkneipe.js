"use strict";

var mittag = require('../util/mittagat.js')

module.exports = {
    intent: /.*hofkneipe.*/i,
    location: "linz",
    getMenu: (callback) => mittag.menu(callback, "hofkneipe")
};
