'use strict';

function checkMobileDevice(req) {
  var userAgent = req.httpHeaders['user-agent'];
  var isMobile = !!userAgent.match(/Mobile/);
  return isMobile;
}

module.exports = { checkMobileDevice: checkMobileDevice };
