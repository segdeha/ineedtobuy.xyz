import { daysSinceLastPurchase } from './dates';
import calculateEstimate from './estimates';
import { Timestamp } from './firebase';

/**
 * Generate data for a new purchase
 * @param {String} barcode 
 * @param {String} token 
 */
let getNewPurchaseData = (barcode, token) => {
    let now = +new Date();
    let seconds = Math.round(now / 1000);
    let new_purchase = {
        barcode,
        estimated_purchase_interval: 14,
        last_purchase: new Timestamp(seconds, 0),
        number_of_purchases: 1,
        token
    };
    return new_purchase;
};

/**
 * Generate data for updating an existing purchase
 * @param {Timestamp} last_purchase 
 * @param {Number} estimated_purchase_interval 
 * @param {Number} number_of_purchases 
 */
let getUpdatedPurchaseData = (last_purchase, estimated_purchase_interval, number_of_purchases) => {
    let now = +new Date();
    let seconds = Math.round(now / 1000);
    let days_since_last_purchase = daysSinceLastPurchase(last_purchase, now);
    let days_until_next_purchase = calculateEstimate(estimated_purchase_interval, days_since_last_purchase, number_of_purchases);
    let updated_purchase = {
        estimated_purchase_interval: days_until_next_purchase,
        last_purchase: new Timestamp(seconds, 0),
        number_of_purchases: number_of_purchases + 1
    };
    return updated_purchase;
};

export { getNewPurchaseData, getUpdatedPurchaseData };

