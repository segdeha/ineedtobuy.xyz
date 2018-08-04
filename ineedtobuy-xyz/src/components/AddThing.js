import React, { Component } from 'react';
import { withFirestore } from 'react-firestore';
import Quagga from 'quagga';
import uuidv4 from 'uuid/v4';

import { daysSinceLastPurchase } from '../lib/dates';
import fetchBarcodeInfo from '../lib/barcodes';
import { getNewPurchaseData, getUpdatedPurchaseData } from '../lib/purchase-data';

import Header from './Header';
import Footer from './Footer';

class AddThing extends Component {
    constructor(props) {
        super(props);
        this.thingExists = this.thingExists.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onBarcodeChange = this.onBarcodeChange.bind(this);
        this.onProcessed = this.onProcessed.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            nameValue: '',
            barcodeValue: '',
            imgSrc: '/img/groceries.svg'
        };
    }

    thingExists(barcode) {
        let { firestore } = this.props;
        let thing = firestore.collection('things').where('barcode', '==', `${barcode}`);
        return thing.get(); // return promise
    }

    thingWasPurchasedWithin24Hours(barcode) {
        let { firestore } = this.props;
        let purchase = firestore.collection('purchases').where('barcode', '==', `${barcode}`);
        return purchase.get(); // return promise
    }

    onProcessed(result) {
        if (result.codeResult) {
            let barcode = result.codeResult.code;

            fetchBarcodeInfo(barcode).then(item => {
                if (item.barcode < 0) {
                    this.setState({
                        barcodeValue: barcode,
                        imgSrc: '/img/groceries.svg'
                    });
                    alert('Unknown barcode. Enter a name for the item.');
                    document.querySelector('[name="intb-name"]').focus();
                }
                else {
                    this.setState({
                        barcodeValue: item.barcode,
                        nameValue: item.name,
                        imgSrc: item.image
                    });
                }
            });
        }
        else {
            alert('No barcode detected.');
        }
    }

    onImageChange(evt) {
        // set values back to original state
        this.setState({
            nameValue: '',
            barcodeValue: '',
            imgSrc: '/img/groceries.svg'
        });
        let files = evt.target.files;
        if (files.length > 0) {
            let file = files[0];
            if (file.type.match(/^image\//)) {
                let image = file;
                let src = URL.createObjectURL(image);

                this.setState({
                    imgSrc: URL.createObjectURL(image)
                });

                Quagga.decodeSingle({
                    decoder: {
                        // chosen based on https://www.scandit.com/types-barcodes-choosing-right-barcode/
                        // executed in order
                        readers: [
                            'upc_reader',
                            'upc_e_reader',
                            'ean_reader',
                            'ean_8_reader'
                        ]
                    },
                    locate: true,
                    src: src
                }, this.onProcessed);
            }
        }
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

        let barcode = document.querySelector('[name="intb-barcode"]').value;
        let name = document.querySelector('[name="intb-name"]').value;
        let image = document.querySelector('#output').src;

        if (!name) {
            alert('Enter the name of the item');
            document.querySelector('[name="intb-name"]').focus();
            return;
        }

        // handle case where there is no barcode by creating a UUID and
        // saving that as the barcode so we're always guaranteed a value
        if (!barcode) {
            barcode = uuidv4();
        }

        // create data for new docs
        let new_thing = { barcode, name, image };

        // TODO handle case where user adds a thing they've already bought
        // 1. check the thing exists
        // 2. check for existing purchases
        // 3. if no existing purchase, process as `new_purchase`
        // 4. if existing purchases, process as `onPurchase`
        this.thingExists(barcode)
            .then(snapshot => {
                let writeBatch = firestore.batch();

                // if the thing is not already in the database, add it
                if (snapshot.empty) {
                    let thingDocRef = firestore.collection('things').doc(barcode);
                    writeBatch.set(thingDocRef, new_thing);
                }

                this.thingWasPurchasedWithin24Hours(barcode)
                    .then(snapshot => {
                        let purchase_data;
                        let purchaseDocRef;
                        if (snapshot.empty) {
                            // new purchase
                            purchaseDocRef = firestore.collection('purchases').doc();
                            purchase_data = getNewPurchaseData(barcode, token);
                        }
                        else {
                            let doc = snapshot.docs[0];
                            let {
                                estimated_purchase_interval,
                                last_purchase,
                                number_of_purchases
                            } = doc.data();

                            let days = daysSinceLastPurchase(last_purchase);

                            // check last purchase date
                            // if within 24 hours, do not add another purchase
                            if (days < 2) {
                                return;
                            }
                            // if more than 24 hours, update doc with new
                            // last_purchase and number_of_purchases
                            else {
                                purchaseDocRef = doc;
                                purchase_data = getUpdatedPurchaseData(last_purchase, estimated_purchase_interval, number_of_purchases);
                            }
                        }

                        writeBatch.set(purchaseDocRef, purchase_data);

                        writeBatch.commit().then(() => {
                            console.log('Successfully executed batch.');
                        });
                    });
            });
    }

    render() {
        let { nameValue, barcodeValue, imgSrc } = this.state;

        return (
            <main className="add-thing full-viewport container">
                <Header />
                <section>
                    <form className="card" onSubmit={this.onSubmit}>
                        <input type="hidden" name="intb-barcode" onChange={this.onBarcodeChange} value={barcodeValue} />
                        <img src={imgSrc} alt="Barcode capture" id="output" />
                        <label className="scan-barcode">
                            Scan barcode
                            <input type="file" name="intb-scan" accept="image/*" capture="environment" onChange={this.onImageChange} />
                        </label>
                        <label>
                            <input type="text" name="intb-name" onChange={this.onNameChange} value={nameValue} placeholder="Enter name of item here" />
                        </label>
                        <p>
                            <button onClick={this.onSubmit}>Add it</button>
                        </p>
                    </form>
                </section>
                <Footer current="add" />
            </main>
        );
    }
}

export default withFirestore(AddThing);
