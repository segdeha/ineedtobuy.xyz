import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withFirestore } from 'react-firestore';

import { Timestamp } from '../lib/firebase.js';

class AddThing extends Component {
    constructor(props) {
        super(props);
        this.thingExists = this.thingExists.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onBarcodeChange = this.onBarcodeChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            nameValue: '',
            barcodeValue: ''
        };
    }

    thingExists(barcode) {
        let { firestore } = this.props;
        let thing = firestore.collection('things').doc(`${barcode}`);
        return thing.get(); // return promise
    }

    onNameChange(evt) {
        this.setState({
            nameValue: evt.target.value
        });
    }

    onBarcodeChange(evt) {
        this.setState({
            barcodeValue: evt.target.value
        });
    }

    onSubmit(evt) {
        evt.preventDefault();

        let { firestore, token } = this.props;

        let name = document.querySelector('[name="intb-name"]').value;
        let barcode = document.querySelector('[name="intb-barcode"]').value;

        // create data for new docs
        let new_thing = { name };

        let now = +new Date();
        let seconds = Math.round(now / 1000);
        let new_purchase = {
            barcode: +barcode,
            estimated_purchase_interval: 14,
            last_purchase: new Timestamp(seconds, 0),
            number_of_purchases: 1,
            token
        };

        this.thingExists(barcode)
            .then(doc => {
                let writeBatch = firestore.batch();
                let purchaseDocRef = firestore.collection('purchases').doc();
                let thingDocRef = firestore.collection('things').doc(barcode);

                // if the thing is not already in the database, add it
                if (!doc.exists) {
                    writeBatch.set(thingDocRef, new_thing);
                }

                writeBatch.set(purchaseDocRef, new_purchase);

                writeBatch.commit().then(() => {
                    console.log('Successfully executed batch.');
                });
            });
    }

    render() {
        let { nameValue, barcodeValue } = this.state;
        return (
            <main className="add-thing container">
                <header>
                    <h1>iNeedToBuy.xyz</h1>
                </header>
                <h2>Add a thing</h2>
                <form onSubmit={this.onSubmit}>
                    <div>
                        <label>
                            Name: <input type="text" name="intb-name" onChange={this.onNameChange} value={nameValue} placeholder="Tofu" />
                        </label>
                    </div>
                    <div>
                        <label>
                            Barcode: <input type="number" name="intb-barcode" onChange={this.onBarcodeChange} value={barcodeValue} placeholder="1234567890" />
                        </label>
                    </div>
                    <p>
                        <button onClick={this.onSubmit}>Add it</button>
                    </p>
                </form>
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

export default withFirestore(AddThing);
