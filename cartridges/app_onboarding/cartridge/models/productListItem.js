'use strict';

var base = module.superModule;
var wishlistHelper = require('*/cartridge/scripts/wishlist/wishlistHelpers');

module.exports = function (productListItemObject) {
  base.call(this, productListItemObject);
  var SitePreferences = dw.system.Site.getCurrent().getPreferences();
  var setWishlistExpirationDate =
    SitePreferences.getCustom()['setWishlistExpirationDate'];
  // get expiration date in milliseconds in case all the data is needed
  var creationDate = productListItemObject.getCreationDate().getTime();
  var expirationDate =
    creationDate + setWishlistExpirationDate * 24 * 60 * 60 * 1000;
  // get amount of days left for the product to expire in wishlist
  var daysLeft = wishlistHelper.getExpirationDaysLeft(expirationDate);
  this.productListItem.wishlistDaysLeft = daysLeft;
  this.productListItem.expirationDate = expirationDate;
};
