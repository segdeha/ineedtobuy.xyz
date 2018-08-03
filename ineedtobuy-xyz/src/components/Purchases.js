import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FirestoreCollection } from 'react-firestore';

import { daysSinceLastPurchase, daysUntilNextPurchase } from '../lib/dates';
import calculateEstimate from '../lib/estimates';
import { Timestamp } from '../lib/firebase.js';

import Loading from './Loading';
import Header from './Header';
import Footer from './Footer';
import PurchaseList from './PurchaseList';

/**
 * Structure of a purchase:
 * barcode<Number>
 * estimated_purchase_interval<Number>
 * last_purchase<Timestamp>
 * token<String>
 */
class Purchases extends Component {
    constructor(props) {
        super(props);
        this.onPurchase = this.onPurchase.bind(this);
    }

    onPurchase(thing, snapshot) {
        let {
            estimated_purchase_interval,
            id,
            last_purchase,
            number_of_purchases
        } = thing;

        let doc;
        snapshot.docs.forEach(docCandidate => {
            if (id === docCandidate.id) {
                doc = docCandidate;
                return;
            }
        });

        let now = +new Date();
        let seconds = Math.round(now / 1000);
        let days_since_last_purchase = daysSinceLastPurchase(last_purchase.seconds, now);
        let days_until_next_purchase = calculateEstimate(estimated_purchase_interval, days_since_last_purchase, number_of_purchases);
        let new_data = {
            estimated_purchase_interval: days_until_next_purchase,
            last_purchase: new Timestamp(seconds, 0),
            number_of_purchases: number_of_purchases + 1
        };

        // save new data to firestore
        doc.ref.set(new_data, { merge: true });
    }

    render() {
        let { token } = this.props;

        return (
            <FirestoreCollection
                path={'purchases'}
                // the sort in the query is an optimization
                // the list will still sort correctly without this
                // the sort requires an index in firestore
                sort='last_purchase:desc,estimated_purchase_interval'
                filter={['token', '==', token]}
                render={({ isLoading, data, snapshot }) => {
                    let purchases;

                    // bail early if we're still waiting for data
                    if (isLoading) {
                        return (
                            <Loading />
                        );
                    }

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
                            <section>
                                <p>Number of purchases: {data.length}</p>
                                <PurchaseList things={things} snapshot={snapshot} onPurchase={this.onPurchase} />
                            </section>
                        );
                    }
                    else {
                        purchases = (
                            <section>
                                <p>No purchases just yet.</p>
                                <p>
                                    <Link to="/add">
                                        Add an item
                                    </Link>
                                </p>
                            </section>
                        );
                    }

                    // everything else to be rendered goes here
                    return (
                        <main className="purchases full-viewport container">
                            <Header />
                            {purchases}
                            <Footer current="purchases" />
                        </main>
                    );
                }}
            />
        );
    }
}

export default Purchases;
