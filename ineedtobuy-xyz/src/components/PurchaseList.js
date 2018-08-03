import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirestore } from 'react-firestore';
import localForage from 'localforage';

import Loading from './Loading';

class PurchaseList extends Component {
    state = {
        thingsWithDetails: null
    };

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
                    let { name, image } = value;
                    let barcode = barcodes[idx];
                    // if it wasn't cached, we'll ask Firestore for it later
                    if (null === value) {
                        unCachedBarcodes.push(barcode);
                    }
                    // if it was cached, add the data to the array to be rendered
                    else {
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
                        let thing = firestore.collection('things').doc(`${barcode}`);
                        promises.push(thing.get());
                    });
                    Promise.all(promises)
                        .then(values => {
                            values.forEach((value) => {
                                let { barcode, name, image } = value.data();
                                let purchase = purchases.find(purchase => {
                                    return barcode === purchase.barcode;
                                });
                                localForage.setItem(barcode, { name, image });
                                let thing = Object.assign(purchase, { name, image });
                                thingsWithDetails.push(thing);
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
            this._loadThingDetails(things);
        }
    }

    componentWillUnmount() {
        // if (this._asyncRequest) {
        //     this._asyncRequest.cancel();
        // }
    }

    render() {
        let { onPurchase, snapshot } = this.props;
        let { thingsWithDetails } = this.state;

        return null === thingsWithDetails ? (
            <Loading />
        ) : (
            <ul>
                {thingsWithDetails.map(thing => {
                    let {
                        barcode,
                        name,
                        image,
                        className
                    } = thing;
                    return (
                        <li className={className} key={barcode}>
                            <img className="purchase" src={image} alt={name} />
                            Name: {name}<br />
                            Barcode: <Link to={`/thing/${barcode}`}>{barcode}</Link><br />
                            <button onClick={() => { onPurchase(thing, snapshot) }}>
                                Bought it!
                            </button>
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default withFirestore(PurchaseList);
