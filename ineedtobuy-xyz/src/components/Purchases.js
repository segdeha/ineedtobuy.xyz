import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { daysUntilNextPurchase } from '../lib/dates';

/**
 * Structure of a purchase:
 * barcode<Number>
 * estimated_purchase_interval<Number>
 * last_purchase<Timestamp>
 * token<String>
 */
class Purchases extends Component {
    render() {
        let { data } = this.props;
        let purchases;

        if (data.length > 0) {
            let things = data.map(thing => {
                let { estimated_purchase_interval, last_purchase } = thing;
                thing.next = daysUntilNextPurchase(estimated_purchase_interval, last_purchase.seconds);
                thing.className = thing.next < 4 ? 'soon' : thing.next < 11 ? 'pretty-soon' : 'not-soon';
                return thing;
            });

            things.sort((a, b) => {
                return a.next > b.next ? 1 : a.next < b.next ? -1 : 0;
            });

            purchases = (
                <Fragment>
                    <p>Number of purchases: {data.length}</p>
                    <ul>
                        {things.map(thing => {
                            let { className, barcode } = thing;
                            return (
                                <li className={className} key={barcode}>
                                    Barcode: <Link to={`/thing/${barcode}`}>{barcode}</Link><br />
                                </li>
                            );
                        })}
                    </ul>
                </Fragment>
            );
        }
        else {
            purchases = (
                <p>No purchases just yet.</p>
            );
        }

        return (
            <main className="purchases container">
                <header>
                    <h1>iNeedToBuy.xyz</h1>
                </header>
                {purchases}
                <footer>
                    <p>
                        <Link to="/add">
                            Add new thing
                        </Link>
                    </p>
                </footer>
            </main>
        );
    }
}

export default Purchases;
