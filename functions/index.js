const functions = require('firebase-functions');
const rules = require('./rules/');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.payment = functions.https.onRequest(async (request, response) => {
 rules.paymentsrules.index(request, response);
});

exports.userActivity = functions.https.onRequest(async (request, response) => {
 rules.userActivityrules.index(request, response);
});
