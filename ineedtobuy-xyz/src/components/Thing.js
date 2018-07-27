import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FirestoreCollection } from 'react-firestore';

import { getLastAndNext } from '../lib/dates';

import Loading from './Loading';
import ThingDetails from './ThingDetails';

class Thing extends Component {
    constructor(props) {
        super(props);

        let { match, data, firebase } = props;

        this.state = {
            html: <div className='loading' />
        };

        // thingDoc
        //     .get()
        //     .then(doc => {
        //         let thing = doc.data();
        //         let { barcode } = thing;


        //         this.setState({
        //             html: (
        //                 <p>
        //                     A thing with barcode {barcode}<br />
        //                     Last purchase: {last}<br />
        //                     Next purchase: {next}<br />
        //                 </p>
        //             )
        //         })
        //     })
    }

    render() {
        let { match, token } = this.props;

        let { barcode } = match.params;

        return (
            <FirestoreCollection
                path={`purchases`}
                filter={[['token', '==', token], ['barcode', '==', +barcode]]}
                render={({ isLoading, data }) => {
                    let purchases;

                    // bail early if we're still waiting for data
                    if (isLoading) {
                        return (
                            <Loading />
                        );
                    }

                    if (data.length > 0) {
                        let thing = data[0];

                        let { last_purchase, estimated_purchase_interval } = thing;
                        let { last, next } = getLastAndNext(last_purchase.seconds, estimated_purchase_interval);

                        purchases = (
                            <ul>
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
                        <main className="thing container">
                            <header>
                                <h1>iNeedToBuy.xyz</h1>
                            </header>
                            <main>
                                <ThingDetails barcode={barcode} />
                                <hr />
                                {purchases}
                            </main>
                            <footer>
                                <p>
                                    <Link to="/">
                                        View purchases
                                    </Link>
                                </p>
                            </footer>
                        </main>
                    );
                }}
            />
        );
    }
}

export default Thing;
