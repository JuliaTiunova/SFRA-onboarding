"use strict";

var server = require("server");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var productListHelper = require("*/cartridge/scripts/productList/productListHelpers");
var Resource = require("dw/web/Resource");
var URLUtils = require("dw/web/URLUtils");
var ProductList = require("dw/customer/ProductList");
var PAGE_SIZE_ITEMS = 15;
var collections = "*cartridge/scripts/util/collections";

server.extend(module.superModule);

server.append(
    "Show",
    consentTracking.consent,
    server.middleware.https,
    csrfProtection.generateToken,
    function (req, res, next) {
        var list = productListHelper.getList(req.currentCustomer.raw, {
            type: 10,
        });
        var WishlistModel = require("*/cartridge/models/productList");
        var userName = "";
        var firstName;
        var rememberMe = false;
        if (req.currentCustomer.credentials) {
            rememberMe = true;
            userName = req.currentCustomer.credentials.username;
        }
        var loggedIn = req.currentCustomer.profile;

        var target = req.querystring.rurl || 1;
        var actionUrl = URLUtils.url("Account-Login");
        var createAccountUrl = URLUtils.url(
            "Account-SubmitRegistration",
            "rurl",
            target
        )
            .relative()
            .toString();
        var navTabValue = req.querystring.action;
        var breadcrumbs = [
            {
                htmlValue: Resource.msg("global.home", "common", null),
                url: URLUtils.home().toString(),
            },
        ];
        if (loggedIn) {
            firstName = req.currentCustomer.profile.firstName;
            breadcrumbs.push({
                htmlValue: Resource.msg(
                    "page.title.myaccount",
                    "account",
                    null
                ),
                url: URLUtils.url("Account-Show").toString(),
            });
        }

        var profileForm = server.forms.getForm("profile");
        profileForm.clear();
        var wishlistModel = new WishlistModel(list, {
            type: "wishlist",
            publicView: false,
            pageSize: PAGE_SIZE_ITEMS,
            pageNumber: 1,
        }).productList;

        // remove expired items from the users list
        wishlistModel.items.forEach((item) => {
            if (item.wishlistDaysLeft < 1) {
                productListHelper.removeItem(
                    req.currentCustomer.raw,
                    item.pid,
                    {
                        req: req,
                        type: 10,
                    }
                );
            }
        });

        res.render("/wishlist/wishlistLanding", {
            wishlist: wishlistModel,
            navTabValue: navTabValue || "login",
            rememberMe: rememberMe,
            userName: userName,
            actionUrl: actionUrl,
            actionUrls: {
                updateQuantityUrl: "",
            },
            profileForm: profileForm,
            breadcrumbs: breadcrumbs,
            oAuthReentryEndpoint: 1,
            loggedIn: loggedIn,
            firstName: firstName,
            socialLinks: loggedIn,
            publicOption: loggedIn,
            createAccountUrl: createAccountUrl,
        });
        next();
    }
);

module.exports = server.exports();
