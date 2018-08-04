import moment from 'moment';

/**
 * Get the last and estimated next purchase dates
 * @param {Number} last_purchase In seconds
 * @param {Number} estimated_purchase_interval In days
 * @param {Boolean} format Whether to return a formatted string
 */
let getLastAndNext = (last_purchase, estimated_purchase_interval, format=true) => {
    let ms = last_purchase * 1000;

    let last = moment(ms);
    let next = moment(ms).add(estimated_purchase_interval, 'days');

    if (format) {
        last = last.format('D MMMM');
        next = next.format('D MMMM');
    }

    return { last, next };
};

/**
 * Calculate the number of days between the 2 values
 * @param {Timestamp} last_purchase With property `.seconds`
 * @param {Number} current_purchase In milliseconds
 */
let daysSinceLastPurchase = (last_purchase, current_purchase = +new Date()) => {
    let last = moment(last_purchase.seconds * 1000);
    let current = moment(current_purchase);
    let diff = current.diff(last, 'days');
    return diff;
};

let daysUntilNextPurchase = (estimated_purchase_interval, last_purchase) => {
    let { next } = getLastAndNext(last_purchase, estimated_purchase_interval, false);
    let diff = next.diff(moment(), 'days');
    return diff;
};

export {
    getLastAndNext,
    daysSinceLastPurchase,
    daysUntilNextPurchase
};
