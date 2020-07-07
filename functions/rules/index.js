'use strict';

const { Engine } = require('json-rules-engine');
const paymentController = require('./payment');
const userActivityController = require('./userActivity');
const {constants} = require('./constants');

module.exports.paymentsrules = paymentController(new Engine(), constants);

module.exports.userActivityrules = userActivityController(new Engine(), constants);
