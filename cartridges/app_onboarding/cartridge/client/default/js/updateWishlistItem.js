"use strict";

var base = require("wishlists/wishlist/wishlist");

function renderNewPageOfItems(pageNumber, spinner, focusElementSelector) {
    var publicView = $(".wishlistItemCardsData").data("public-view");
    var listUUID = $(".wishlistItemCardsData").data("uuid");
    var url = $(".wishlistItemCardsData").data("href");

    if (spinner) {
        $.spinner().start();
    }
    var scrollPosition = document.documentElement.scrollTop;
    var newPageNumber = pageNumber;
    $.ajax({
        url: url,
        method: "get",
        data: {
            pageNumber: ++newPageNumber,
            publicView: publicView,
            id: listUUID,
        },
    })
        .done(function (data) {
            $(".wishlistItemCards").empty();
            $("body .wishlistItemCards").append(data);

            if (focusElementSelector) {
                $(focusElementSelector).focus();
            } else {
                document.documentElement.scrollTop = scrollPosition;
            }
        })
        .fail(function () {
            $(".more-wl-items").remove();
        });
    $.spinner().stop();
}

function displayErrorMessage($elementAppendTo, msg) {
    if ($(".remove-from-wishlist-messages").length === 0) {
        $elementAppendTo.append(
            '<div class="remove-from-wishlist-messages "></div>'
        );
    }
    $(".remove-from-wishlist-messages").append(
        '<div class="remove-from-wishlist-alert text-center alert-danger">' +
            msg +
            "</div>"
    );

    setTimeout(function () {
        $(".remove-from-wishlist-messages").remove();
    }, 3000);
}

function removeFromWishlist(e) {
    e.preventDefault();
    var url = $(this).data("url");
    var elMyAccount = $(".account-wishlist-item").length;

    // If user is in my account page, call removeWishlistAccount() end point, re-render wishlist cards
    if (elMyAccount > 0) {
        $(".wishlist-account-card").spinner().start();
        $.ajax({
            url: url,
            type: "get",
            dataType: "html",
            data: {},
            success: function (html) {
                $(".wishlist-account-card>.card").remove();
                $(".wishlist-account-card").append(html);
                $(".wishlist-account-card").spinner().stop();
            },
            error: function () {
                var $elToAppend = $(".wishlist-account-card");
                $elToAppend.spinner().stop();
                var msg = $elToAppend.data("error-msg");
                displayErrorMessage($elToAppend, msg);
            },
        });
        // else user is in wishlist landing page, call removeProduct() end point, then remove this card
    } else {
        $.spinner().start();
        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            data: {},
            success: function () {
                var pageNumber =
                    $(".wishlistItemCardsData").data("page-number") - 1;
                renderNewPageOfItems(pageNumber, false);
                // display new amount of products
                var count = $(".wishlist-amount").data("length");
                var msg = $(".wishlist-amount").data("amount");
                $(".wishlist-amount").empty();
                $(".wishlist-amount").append(count - 1 + " " + msg);
                $(".wishlist-amount").data("length", count - 1);
            },
            error: function () {
                $.spinner().stop();
                var $elToAppendWL = $(".wishlistItemCards");
                var msg = $elToAppendWL.data("error-msg");
                displayErrorMessage($elToAppendWL, msg);
            },
        });
    }
}

$(document).ready(function () {
    $("body")
        .off("click", ".remove-from-wishlist")
        .on("click", ".remove-from-wishlist", removeFromWishlist);
    base.removeFromWishlist = removeFromWishlist;
    module.exports = base;
});
