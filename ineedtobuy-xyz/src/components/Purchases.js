import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

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
            purchases = (
                <Fragment>
                    <p>Live data:</p>
                    <ul>
                        <li>Number of purchases: {data.length}</li>
                        {data.map(thing => {
                            let { barcode, estimated_purchase_interval, last_purchase } = thing;
                            return (
                                <li key={barcode}>
                                    Barcode: <Link to={`/thing/${barcode}`}>{barcode}</Link><br />
                                    Estimated purchase interval: {estimated_purchase_interval}<br />
                                    Timestamp: {(new Date(last_purchase.seconds * 1000)).toString()}<br />
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
                <h1>iNeedToBuy.xyz</h1>
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
