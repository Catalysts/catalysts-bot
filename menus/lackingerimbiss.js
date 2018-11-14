"use strict";

var mittag = require('../util/mittagat.js');

module.exports = {
    intent: /.*lackingers-imbiss.*/i,
    location: "linz",
    getMenu: (callback) => mittag.menu(callback, "lackingers-imbiss-gallanderstr")
};