"use strict";

var processInclude = require("base/util");

$(document).ready(function () {
    processInclude(require("wishlists/product/details"));
    processInclude(require("wishlists/product/wishlist"));
    processInclude(require("giftRegistry/product/giftRegistry"));
});
