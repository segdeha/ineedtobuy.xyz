import React, { Component } from 'react';
import { withFirestore } from 'react-firestore';
import Quagga from 'quagga';

import { Timestamp } from '../lib/firebase.js';
import fetchBarcodeInfo from '../lib/barcodes.js';

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
        let thing = firestore.collection('things').doc(`${barcode}`);
        return thing.get(); // return promise
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

        let name = document.querySelector('[name="intb-name"]').value;
        let barcode = document.querySelector('[name="intb-barcode"]').value;
        let image = document.querySelector('#output').src;

        // create data for new docs
        let new_thing = { barcode, name, image };

        let now = +new Date();
        let seconds = Math.round(now / 1000);
        let new_purchase = {
            barcode: barcode,
            estimated_purchase_interval: 14,
            last_purchase: new Timestamp(seconds, 0),
            number_of_purchases: 1,
            token
        };

        // TODO handle case where user adds a thing they've already bought
        // 1. check the thing exists
        // 2. check for existing purchases
        // 3. if no existing purchase, process as `new_purchase`
        // 4. if existing purchases, process as `onPurchase`
        this.thingExists(barcode)
            .then(doc => {
                let writeBatch = firestore.batch();
                let purchaseDocRef = firestore.collection('purchases').doc();

                // if the thing is not already in the database, add it
                if (!doc.exists) {
                    let thingDocRef = firestore.collection('things').doc(barcode);
                    writeBatch.set(thingDocRef, new_thing);
                }

                writeBatch.set(purchaseDocRef, new_purchase);

                writeBatch.commit().then(() => {
                    console.log('Successfully executed batch.');
                });
            });
    }

    render() {
        let { nameValue, barcodeValue, imgSrc } = this.state;

        return (
            <main className="add-thing full-viewport container">
                <header>
                    <h1>iNeedToBuy.xyz</h1>
                </header>
                <h2>Add a thing</h2>
                <form onSubmit={this.onSubmit}>
                    <img src={imgSrc} alt="Barcode capture" id="output" style={{
                        maxWidth: '90vw'
                    }} />
                    <div>
                        <label>
                            Scan barcode: <input type="file" name="intb-scan" accept="image/*" capture="environment" onChange={this.onImageChange} />
                        </label>
                    </div>
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
                <Footer current="add" />
            </main>
        );
    }
}

export default withFirestore(AddThing);
