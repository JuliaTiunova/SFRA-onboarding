'use strict';

var base = module.superModule;

function addItem(list, pid, config) {
  var Transaction = require('dw/system/Transaction');

  if (!list) {
    return false;
  }

  var itemExist = base.itemExists(list, pid, config);

  if (!itemExist) {
    var ProductMgr = require('dw/catalog/ProductMgr');

    var apiProduct = ProductMgr.getProduct(pid);

    if (apiProduct.variationGroup) {
      return false;
    }

    if (apiProduct && list && config.qty) {
      try {
        Transaction.begin();
        var wishlistHelper = require('*/cartridge/scripts/wishlist/wishlistHelpers');
        var SitePreferences = dw.system.Site.getCurrent().getPreferences();
        var productlistItem = list.createProductItem(apiProduct);

        if (apiProduct.optionProduct) {
          var optionModel = apiProduct.getOptionModel();
          var option = optionModel.getOption(config.optionId);
          var optionValue = optionModel.getOptionValue(
            option,
            config.optionValue
          );

          optionModel.setSelectedOptionValue(option, optionValue);
          productlistItem.setProductOptionModel(optionModel);
        }
        if (apiProduct.master) {
          productlistItem.setPublic(false);
        }
        var setWishlistExpirationDate =
          SitePreferences.getCustom()['setWishlistExpirationDate'];
        var expirationDate =
          productlistItem.creationDate.getTime() +
          setWishlistExpirationDate * 24 * 60 * 60 * 1000;
        var daysLeft = wishlistHelper.getExpirationDaysLeft(expirationDate);
        productlistItem.custom.wishlistDaysLeft = daysLeft;
        productlistItem.custom.expirationDate = new Date(expirationDate);
        productlistItem.setQuantityValue(config.qty);
        Transaction.commit();
      } catch (e) {
        return false;
      }
    }

    if (config.type === 10) {
      base.updateWishlistPrivacyCache(
        config.req.currentCustomer.raw,
        config.req,
        config
      );
    }

    return true;
  } else if (itemExist && config.type === 11) {
    Transaction.wrap(function () {
      itemExist.setQuantityValue(itemExist.quantityValue + config.qty);
    });

    return true;
  }

  return false;
}

base.addItem = addItem;
module.exports = base;
