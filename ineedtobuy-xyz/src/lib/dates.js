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

let daysUntilNextPurchase = (estimated_purchase_interval, last_purchase) => {
    let { next } = getLastAndNext(last_purchase, estimated_purchase_interval, false);
    return next.diff(moment(), 'days');
};

export {
    getLastAndNext,
    daysUntilNextPurchase
};
