'use strict';

const {Engine} = require('json-rules-engine');
const paymentController = require('./payment');
const userActivityController = require('./userActivity');

module.exports.paymentsrules = paymentController(new Engine());

module.exports.userActivityrules = userActivityController(new Engine());
