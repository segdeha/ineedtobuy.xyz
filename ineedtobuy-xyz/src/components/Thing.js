import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import moment from 'moment';

class Thing extends Component {
    render() {
        let { match, data } = this.props;
        let { barcode } = match.params;

        let thing = data.find(thing => {
            return thing.barcode === barcode;
        });

        let mo = moment(thing.last_purchase * 1000);

        let last = mo.format('D MMMM');
        let next = mo.add(14, 'days').format('D MMMM');

        return (
            <main className="thing container">
                <header>
                    <h1>iNeedToBuy.xyz</h1>
                </header>
                <p>A thing with barcode {barcode}</p>
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
