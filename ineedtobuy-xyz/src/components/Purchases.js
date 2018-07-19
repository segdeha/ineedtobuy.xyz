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
            data.sort((a, b) => {
                return a.last_purchase > b.last_purchase ? 1 : a.last_purchase < b.last_purchase ? -1 : 0;
            });
            purchases = (
                <Fragment>
                    <p>Number of purchases: {data.length}</p>
                    <ul>
                        {data.map(thing => {
                            let { barcode, estimated_purchase_interval, last_purchase } = thing;
                            let next = daysUntilNextPurchase(estimated_purchase_interval, last_purchase.seconds);
                            let className = next < 4 ? 'soon' : next < 11 ? 'pretty-soon' : 'not-soon';

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
