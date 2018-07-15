const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.updateNextPurchaseEstimate = functions.https.onRequest((request, response) => {});

// we can either trigger on an HTTP request (as above) or potentially on a write event
// to firestore itself (the latter might be preferably, actually)

/*

when a write action takes place, the following should happen:
 - calculate a new next purchase estimate for the item(s) written
    - if there is only 1 event in the history for an item, next purchase is the default (2 weeks?)
    - when there are 2 or more events, next purchase is the average interval
        - adjust for quantity? is it an interval of time per unit of thing?
        - need to handle the case where a seldom bought item will always be at the top of the list
            - if the last purchase is more than 6 weeks, put it at the bottom?

when there are many purchase events, consider weighting the intervals by recency

in the following example, the number of purchase events is the weight of the most recent purchase
the next most recent purchase is weighted at n - 1, the next most recent at n - 2, and so on

1   1/1                         estimate: 14.0 days (default)
2   1/15    interval: 14 days   estimate: 14.0 days (14 * 1)
3   1/22    interval:  7 days   estiamte:  9.3 days (14 * 1 + 7 * 2 / 3)
4   1/29    interval:  7 days   estiamte:  8.2 days (14 * 1 + 7 * 2 + 7 * 3 / 6)
5   2/8     interval: 10 days   estimate:  8.9 days (14 * 1 + 7 * 2 + 7 * 3 + 10 * 4 / 10)

another way might be to take the previous estimate and do a weighted average with the
most recent estimate (one advantage is that this is much less costly to calculate)

1   1/1                         estimate: 14.0 days (default)
2   1/15    interval: 14 days   estimate: 14.0 days (14 * 1 + 14 * 2 / 3)
3   1/22    interval:  7 days   estimate:  9.8 days (14 * 2 + 7 * 3 / 5)
4   1/29    interval:  7 days   estiamte:  8.2 days (9.8 * 3 + 7 * 4 / 7)
5   2/8     interval: 10 days   estimate:  9.2 days (8.2 * 4 + 10 * 5 / 9)


*/
