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

        this.state = {
            query: '',
            queryValue: ''
        };

        this.onDelete = this.onDelete.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onPurchase = this.onPurchase.bind(this);
    }

    onSearch(evt) {
        let queryValue = evt.target.value;
        let state = {
            query: '',
            queryValue: ''
        };

        if (queryValue) {
            state = {
                query: queryValue,
                queryValue
            };
        }

        this.setState(state);
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

    onPurchase(thing, firestore) {
        let {
            estimated_purchase_interval,
            id,
            last_purchase,
            number_of_purchases
        } = thing;

        let docRef = firestore.collection('purchases').doc(id);

        if (docRef) {
            let purhcase_data = getUpdatedPurchaseData(last_purchase, estimated_purchase_interval, number_of_purchases);

            // save new data to firestore
            docRef.set(purhcase_data, { merge: true })
                .then(() => {
                    console.log('Purchase updated successfully');
                })
                .catch(console.log);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let { query } = this.state;
        return query !== nextState.query;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.queryValue && this.search) {
            this.search.focus();
        }
    }

    _preparePurchaseData(data) {
        let { query } = this.state;
        let things = data;

        // narrow the list based on user input
        if (query) {
            let rgx = new RegExp(query, 'i');
            things = things.filter(thing => {
                return rgx.test(thing.name);
            });
        }

        // add next purchase date and class name to each thing
        things = things.map(thing => {
            let { estimated_purchase_interval, last_purchase } = thing;
            thing.next = daysUntilNextPurchase(estimated_purchase_interval, last_purchase.seconds);
            thing.className = thing.next < 4 ? 'soon' : thing.next < 11 ? 'pretty-soon' : 'not-soon';
            return thing;
        });

        // sort by how soon the user is estiamted to need to buy the item
        things.sort((a, b) => {
            return a.next > b.next ? 1 : a.next < b.next ? -1 : 0;
        });

        return things;
    }

    render() {
        let { token } = this.props;
        let { queryValue } = this.state;

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
                                <ul className="purchases-list">
                                    <li className="search">
                                        <form>
                                            <input
                                                type="text"
                                                name="intb-search"
                                                value={queryValue}
                                                placeholder="Filter list"
                                                onChange={this.onSearch}
                                                ref={input => { this.search = input }}
                                            />
                                        </form>
                                    </li>
                                </ul>
                                <PurchaseList things={things} snapshot={snapshot} onPurchase={this.onPurchase} onSearch={this.onSearch} queryValue={queryValue} />
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
