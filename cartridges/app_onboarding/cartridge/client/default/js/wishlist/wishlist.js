'use strict';

var base = require('wishlists/wishlist/wishlist');

function renderNewPageOfItems(pageNumber, spinner, focusElementSelector) {
  var wishlistItemCardsData = document.querySelector('.wishlistItemCardsData');

  var publicView = wishlistItemCardsData.dataset.publicView;
  var listUUID = wishlistItemCardsData.dataset.uuid;
  var url = wishlistItemCardsData.dataset.href;

  var scrollPosition = document.documentElement.scrollTop;
  var newPageNumber = pageNumber;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send({
    pageNumber: ++newPageNumber,
    publicView: publicView,
    id: listUUID,
  });
  xhr.onload = function () {
    if (xhr.status != 200) {
      var moreWlItems = document.querySelector('.more-wl-items');
      moreWlItems.remove();
    } else {
      var data = xhr.response;
      var wishlistItemCards = document.querySelector('body .wishlistItemCards');
      wishlistItemCards.innerHTML = data;

      // trying to add listener dynamically and remove old listener

      //   var removeFromWishlistElements = document.querySelectorAll(
      //     'body .remove-from-wishlist'
      //   );
      //   removeFromWishlistElements.forEach((element) => {
      //     element.removeEventListener('click', removeFromWishlist);
      //     element.addEventListener('click', removeFromWishlist);
      //   });

      if (focusElementSelector) {
        focusElementSelector.focus();
      } else {
        document.documentElement.scrollTop = scrollPosition;
      }
    }
  };
}

function displayErrorMessage(elementAppendTo, msg) {
  var removeFromWishlistMessagesAll = document.querySelectorAll(
    '.remove-from-wishlist-messages'
  );
  if (removeFromWishlistMessagesAll.length === 0) {
    var removeFromWishlistMessages = document.createElement('div');
    removeFromWishlistMessages.classList.add('remove-from-wishlist-messages');
    elementAppendTo.append(removeFromWishlistMessages);
  }
  var removeFromWishlistMessages = document.querySelector(
    '.remove-from-wishlist-messages'
  );
  var alertMesssage = document.createElement('div');
  alertMesssage.classList.add('remove-from-wishlist-alert');
  alertMesssage.classList.add('text-center');
  alertMesssage.classList.add('alert-danger');
  alertMesssage.innerHTML = msg;
  removeFromWishlistMessages.append(alertMesssage);

  setTimeout(function () {
    removeFromWishlistMessages.remove();
  }, 3000);
}

function removeFromWishlist(e) {
  e.preventDefault();
  var url = this.dataset.url;
  var elMyAccount = document.querySelectorAll('.account-wishlist-item').length;

  // If user is in my account page, call removeWishlistAccount() end point, re-render wishlist cards
  if (elMyAccount > 0) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.send();
    xhr.onload = function () {
      var data = xhr.response;
      if (xhr.status != 200) {
        var elToAppend = document.querySelector('.wishlist-account-card');
        var msg = elToAppend.dataset.errorMsg;
        displayErrorMessage(elToAppend, msg);
      } else {
        var wishlistAccountCard = document.querySelector(
          '.wishlist-account-card'
        );
        var card = document.querySelector('.wishlist-account-card>.card');
        card.remove();
        wishlistAccountCard.innerHTML += data;
      }
    };

    // else user is in wishlist landing page, call removeProduct() end point, then remove this card
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
      var data = xhr.response;

      if (xhr.status != 200) {
        var elToAppendWL = document.querySelector('.wishlistItemCards');
        var msg = elToAppendWL.dataset.errorMsg;
        displayErrorMessage(elToAppendWL, msg);
      } else {
        var pageNumber =
          document.querySelector('.wishlistItemCardsData').dataset.pageNumber -
          1;
        renderNewPageOfItems(pageNumber, false);
        // display new amount of products
        var wishlistAmount = document.querySelector('.wishlist-amount');
        var count = wishlistAmount.dataset.length;
        var msg = wishlistAmount.dataset.amount;
        wishlistAmount.innerHTML = count - 1 + ' ' + msg;
        wishlistAmount.dataset.length = count - 1;
      }
    };
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // trying to remove event listener

  //   var removeFromWishlistElements = document.querySelectorAll(
  //     'body .remove-from-wishlist'
  //   );
  //   removeFromWishlistElements.forEach((element) => {
  //     element.removeEventListener('click', base.removeFromWishlist);
  //     element.addEventListener('click', removeFromWishlist);
  //   });

  $('body')
    .off('click', '.remove-from-wishlist')
    .on('click', '.remove-from-wishlist', removeFromWishlist);
  base.removeFromWishlist = removeFromWishlist;
  //   base.renderNewPageOfItems = renderNewPageOfItems;
  module.exports = base;
});
