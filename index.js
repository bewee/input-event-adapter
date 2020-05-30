/**
 * index.js - Loads the input event adapter.
 */

'use strict';

const InputEventAdapter = require('./lib/adapter');

module.exports = (addonManager) => {
  new InputEventAdapter(addonManager);
};
