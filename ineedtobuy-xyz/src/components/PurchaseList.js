import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withFirestore } from 'react-firestore';
import localForage from 'localforage';
import Hammer from 'hammerjs';

import { daysSinceLastPurchase } from '../lib/dates';

import Loading from './Loading';

class PurchaseList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            thingsWithDetails: null,
            query: '',
            queryValue: ''
        };

        this.addSwipeListeners = this.addSwipeListeners.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    _loadThingDetails(purchases) {
        let { firestore } = this.props;
        let thingsWithDetails = [];
        let promises = [];
        let barcodes = [];
        let unCachedBarcodes = [];

        purchases.forEach(purchase => {
            // check localForage first
            // if the item isn't in localForage, add the barcode to unCachedBarcodes
            // make a 2nd pass, hitting Firestore for the unCachedBarcodes
            promises.push(localForage.getItem(purchase.barcode));
            barcodes.push(purchase.barcode);
        });

        Promise.all(promises)
            .then(values => {
                values.forEach((value, idx) => {
                    let barcode = barcodes[idx];
                    // if it wasn't cached, we'll ask Firestore for it later
                    if (null === value) {
                        unCachedBarcodes.push(barcode);
                    }
                    // if it was cached, add the data to the array to be rendered
                    else {
                        let { name, image } = value;
                        let purchase = purchases.find(purchase => {
                            return barcode === purchase.barcode;
                        });
                        let thing = Object.assign(purchase, { name, image });
                        thingsWithDetails.push(thing);
                    }
                });
                if (unCachedBarcodes.length > 0) {
                    // query firestore
                    let promises = [];
                    unCachedBarcodes.forEach(barcode => {
                        let thing = firestore.collection('things').where('barcode', '==', `${barcode}`);
                        promises.push(thing.get());
                    });
                    Promise.all(promises)
                        .then(snapshots => {
                            snapshots.forEach(snapshot => {
                                if (snapshot.empty) {
                                    console.log('Warning: Probably purchase data for a deleted thing');
                                }
                                else {
                                    let doc = snapshot.docs[0];
                                    let { barcode, name, image } = doc.data();
                                    let purchase = purchases.find(purchase => {
                                        return barcode === purchase.barcode;
                                    });
                                    localForage.setItem(barcode, { name, image });
                                    let thing = Object.assign(purchase, { name, image });
                                    thingsWithDetails.push(thing);
                                }
                            });

                            // set state with values
                            this.setState({ thingsWithDetails });
                        })
                        .catch(console.log);
                }
                else {
                    // set state with values
                    this.setState({ thingsWithDetails });
                }
            })
            .catch(console.log);
    }

    componentDidMount() {
        let { things } = this.props;
        this._loadThingDetails(things);
    }

    componentWillReceiveProps(nextProps) {
        let { things } = this.props;

        if (nextProps.things.length !== things.length) {
            this.setState({thingsWithDetails: null});
            this._loadThingDetails(nextProps.things);
        }
    }

    componentWillUnmount() {
        // TODO figure out how to do this with Firestore
        // if (this._asyncRequest) {
        //     this._asyncRequest.cancel();
        // }
    }

    addSwipeListeners() {
        let lis = document.querySelectorAll('.purchases-list li');
        for (let i = 0; i < lis.length; i += 1) {
            let mc = Hammer(lis[i]);
            mc.on('swipeleft', evt => {
                evt.target.parentNode.classList.add('swiped');
            });
            mc.on('swiperight', evt => {
                evt.target.parentNode.classList.remove('swiped');
            });
        }
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

    render() {
        let { onDelete, onPurchase, firestore } = this.props;
        let { thingsWithDetails, query, queryValue } = this.state;

        let rgx;
        if (query) {
            rgx = new RegExp(query, 'i');
        }

        window.requestAnimationFrame(this.addSwipeListeners);

        return null === thingsWithDetails ? (
            <Loading />
        ) : (
            <Fragment>
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
                <ul className="purchases-list">
                    {thingsWithDetails.map(thing => {
                        let {
                            barcode,
                            id,
                            name,
                            image,
                            className,
                            last_purchase
                        } = thing;

                        if (rgx && !rgx.test(name)) {
                            return null;
                        }

                        let boughtIt = daysSinceLastPurchase(last_purchase) < 2 ? 'bought-it' : '';

                        return (
                            <li data-id={id} key={barcode}>
                                <div
                                    className="delete-link"
                                    onClick={() => { onDelete(id, firestore) }}
                                />
                                <button
                                    className={`${className} ${boughtIt}`}
                                    onClick={evt => { onPurchase(thing, firestore, evt.target) }}
                                />
                                <figure className="thumbnail">
                                    <img src={image} alt={name} />
                                </figure>
                                <Link className="detail-link" to={`/thing/${barcode}`}>
                                    {name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </Fragment>
        );
    }
}

export default withFirestore(PurchaseList);
