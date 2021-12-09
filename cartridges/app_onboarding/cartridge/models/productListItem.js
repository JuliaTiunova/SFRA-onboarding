'use strict';

var base = module.superModule;

module.exports = function (productListItemObject) {
  base.call(this, productListItemObject);

  this.productListItem.wishlistDaysLeft =
    productListItemObject.custom.wishlistDaysLeft;
  this.productListItem.expirationDate =
    productListItemObject.custom.expirationDate;
};
