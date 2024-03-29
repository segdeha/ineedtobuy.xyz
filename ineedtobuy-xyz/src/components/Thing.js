import React, { Component } from 'react';
import { FirestoreCollection } from 'react-firestore';

import { getLastAndNext } from '../lib/dates';

import Loading from './Loading';
import Header from './Header';
import Footer from './Footer';
import ThingDetails from './ThingDetails';

class Thing extends Component {
    render() {
        let { match, token } = this.props;

        let { barcode } = match.params;

        return (
            <FirestoreCollection
                path={'purchases'}
                filter={[['token', '==', token], ['barcode', '==', barcode]]}
                render={({ isLoading, data }) => {
                    let purchases;

                    // bail early if we're still waiting for data
                    if (isLoading) {
                        return (
                            <Loading token={token} />
                        );
                    }

                    if (data.length > 0) {
                        let thing = data[0];
                        let { last_purchase, estimated_purchase_interval, number_of_purchases } = thing;
                        let { last, next } = getLastAndNext(last_purchase.seconds, estimated_purchase_interval);

                        purchases = (
                            <ul>
                                <li>Number of purchases: {number_of_purchases}</li>
                                <li>Last purchase: {last}</li>
                                <li>Next purchase: {next}</li>
                            </ul>
                        );
                    }
                    else {
                        purchases = (
                            <p>You have not yet purchased this thing.</p>
                        );
                    }

                    return (
                        <main className="thing full-viewport container">
                            <Header token={token} />
                            <section>
                                <ThingDetails barcode={barcode} />
                                <div className="purchases">
                                    {purchases}
                                </div>
                            </section>
                            <Footer current="thing" />
                        </main>
                    );
                }}
            />
        );
    }
}

export default Thing;
