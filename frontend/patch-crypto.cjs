const crypto = require('crypto');

if (!crypto.getRandomValues) {
  crypto.getRandomValues = function (arr) {
    return crypto.randomFillSync(arr);
  };
}

if (!globalThis.crypto) {
  globalThis.crypto = crypto.webcrypto || {};
}

if (!globalThis.crypto.getRandomValues) {
  globalThis.crypto.getRandomValues = function (arr) {
    return crypto.randomFillSync(arr);
  };
}
