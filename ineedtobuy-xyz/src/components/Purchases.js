import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FirestoreCollection } from 'react-firestore';

import { daysUntilNextPurchase } from '../lib/dates';
import { getUpdatedPurchaseData } from '../lib/purchase-data';

import Loading from './Loading';
import Header from './Header';
import Footer from './Footer';
import PurchaseList from './PurchaseList';

/**
 * Structure of a purchase:
 * barcode<Number>
 * estimated_purchase_interval<Number>
 * number_of_purchases<Number>
 * last_purchase<Timestamp>
 * token<String>
 */
class Purchases extends Component {
    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);
        this.onPurchase = this.onPurchase.bind(this);
    }

    onDelete(id, firestore) {
        let li = document.querySelector(`[data-id="${id}"]`);
        if (window.confirm('Are you sure you want to delete this item and its purchase history?')) {
            let docRef = firestore.collection('purchases').doc(id);
            if (docRef) {
                docRef.delete()
                    .then(() => {
                        // animate element out of the DOM
                        // i haven't figured out how to get Firestore to re-fetch
                        // so the element will remain until the next data fetch
                        li.classList.add('fade');
                        setTimeout(() => {
                            li.classList.add('hide');
                        }, 500);
                    }).catch(console.error);
            }
        }
        else {
            li.classList.remove('swiped');
        }
    }

    onPurchase(thing, firestore, el) {
        let {
            estimated_purchase_interval,
            id,
            last_purchase,
            number_of_purchases
        } = thing;

        let docRef = firestore.collection('purchases').doc(id);

        if (docRef) {
            let purhcase_data = getUpdatedPurchaseData(last_purchase, estimated_purchase_interval, number_of_purchases);

            // show loading spinner
            el.classList.add('buying-it');

            // save new data to firestore
            docRef.set(purhcase_data, { merge: true })
                .then(() => {
                    el.classList.remove('buying-it');
                    el.classList.add('bought-it');
                    console.log('Purchase updated successfully');
                })
                .catch(console.log);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.queryValue && this.search) {
            this.search.focus();
        }
    }

    // determine the class name for a given thing
    // class name is based on number of days until next predicted purchase
    // except when there has been only 1 purchase
    // or when there has been a really long time since the last purchase
    _getClassNameForThing(thing) {
        let className;
        if (thing.number_of_purchases < 2) {
            className = 'dormant';
        }
        else if (thing.next < -2 * thing.estimated_purchase_interval) {
            className = 'dormant';
        }
        else if (thing.next < 2) {
            className = 'soon';
        }
        else if (thing.next < 11) {
            className = 'pretty-soon';
        }
        else {
            className = 'not-soon';
        }
        return className;
    }

    _preparePurchaseData(data) {
        let things = data;

        // add next purchase date and class name to each thing
        things = things.map(thing => {
            let { estimated_purchase_interval, last_purchase } = thing;
            thing.next = daysUntilNextPurchase(estimated_purchase_interval, last_purchase.seconds);
            thing.className = this._getClassNameForThing(thing);
            return thing;
        });

        // sort by how soon the user is estiamted to need to buy the item
        // if the item is dormant, always put it last
        things.sort((a, b) => {
            return a.next > b.next ? 1 : a.next < b.next ? -1 : 0;
        });

        // extract dormant items so we can put them at the end of the array
        let dormantThings = things.filter(thing => {
            return thing.className === 'dormant';
        });

        things = things.filter(thing => {
            return thing.className !== 'dormant';
        });

        things = things.concat(dormantThings);

        return things;
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
                            <Loading token={token} />
                        );
                    }

                    if (data.length > 0) {
                        let things = this._preparePurchaseData(data);

                        purchases = (
                            <section>
                                <PurchaseList
                                    things={things}
                                    snapshot={snapshot}
                                    onDelete={this.onDelete}
                                    onPurchase={this.onPurchase}
                                />
                            </section>
                        );
                    }
                    else {
                        purchases = (
                            <section>
                                <div className="card">
                                    <p>No purchases just yet.</p>
                                    <form>
                                        <Link className="button add-item" to="/add">
                                            Add an item
                                        </Link>
                                    </form>
                                </div>
                            </section>
                        );
                    }

                    // everything else to be rendered goes here
                    return (
                        <main className="purchases full-viewport container">
                            <Header token={token} />
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
