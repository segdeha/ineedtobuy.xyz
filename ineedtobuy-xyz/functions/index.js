const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/**
 * Calculate a weighted estimate for the interval until the next purchase
 * Current purchase a tiny bit less weight than all previous purchases
 * @param {Number} lastEstimate The last stored purchase interval estimate
 * @param {Number} latestInterval The interval between the most recent and previous purchases
 * @param {Number} purchaseHistoryLength Total number of purchases for the item
 */
const calculateEstimate = (lastEstimate, latestInterval, purchaseHistoryLength) => {
    let previousFactor = lastEstimate * purchaseHistoryLength;
    let latestFactor = latestInterval * purchaseHistoryLength - 1;
    let totalDivisor = purchaseHistoryLength * 2 - 1;
    return (previousFactor + latestFactor) / totalDivisor;
};

exports.updateNextPurchaseEstimate = functions.https.onRequest((request, response) => {});

// we can either trigger on an HTTP request (as above) or potentially on a write event
// to firestore itself (the latter might be preferably, actually)

/*

when a write action takes place, the following should happen:
 - calculate a new next purchase estimate for the item(s) written
     - if there is only 1 event in the history for an item, next purchase is the default (2 weeks?)
     - when there are 2 or more events, next purchase is the weighted average interval
         - adjust for quantity? is it an interval of time per unit of thing?
         - need to handle the case where a seldom bought item will always be at the top of the list
             - if the last purchase is more than 6 weeks, put it at the bottom?
 - save new estimate for the item

do a weighted average with the most recent estimate, giving the most recent purchase
just a little less weight than all previous purchases:

1   1/1                         estimate: 14.0 days (default)
2   1/15    interval: 14 days   estimate: 14.0 days (14 * 2 + 14 * 1 / 3)
3   1/22    interval:  7 days   estimate:  9.8 days (14 * 3 + 7 * 2 / 5)
4   1/29    interval:  7 days   estiamte:  8.6 days (9.8 * 4 + 7 * 3 / 7)
5   2/8     interval: 10 days   estimate:  9.2 days (8.6 * 5 + 10 * 4 / 9)

*/
