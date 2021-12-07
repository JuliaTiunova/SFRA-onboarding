'use strict';

var processInclude = require('base/util');

$(document).ready(function () {
  processInclude(require('wishlists/wishlist/wishlist'));
  processInclude(require('./wishlist/wishlist'));
});
