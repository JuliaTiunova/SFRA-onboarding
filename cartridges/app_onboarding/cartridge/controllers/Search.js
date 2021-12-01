'use strict';
var base = module.superModule;

var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.extend(base);

server.append('Refinebar', cache.applyDefaultCache, function (req, res, next) {
  var viewData = res.getViewData();
  var userAgent = req.httpHeaders['user-agent'];
  var isMobile = !!userAgent.match(/Mobile/);
  viewData.isMobile = isMobile;
  // set view data to use condition on a template
  res.setViewData(viewData);
  next();
});

module.exports = server.exports();
