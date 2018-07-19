import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { getLastAndNext } from '../lib/dates';

class Thing extends Component {
    render() {
        let { match, data } = this.props;
        let { barcode } = match.params;

        let thing = data.find(thing => {
            return thing.barcode === +barcode;
        });

        let { last_purchase, estimated_purchase_interval } = thing;
        let { last, next } = getLastAndNext(last_purchase.seconds, estimated_purchase_interval);

        return (
            <main className="thing container">
                <header>
                    <h1>iNeedToBuy.xyz</h1>
                </header>
                <p>
                    A thing with barcode {barcode}<br />
                    Last purchase: {last}<br />
                    Next purchase: {next}<br />
                </p>
                <footer>
                    <p>
                        <Link to="/">
                            View purchases
                        </Link>
                    </p>
                </footer>
            </main>
        );
    }
}

export default Thing;
