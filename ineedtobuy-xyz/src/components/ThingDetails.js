import React, { Component } from 'react';
import { FirestoreDocument } from 'react-firestore';

import Loading from './Loading';

class ThingDetails extends Component {
    render() {
        let { barcode } = this.props;

        return (
            <FirestoreDocument
                path={`things/${barcode}`}
                render={({ isLoading, data }) => {
                    // bail early if we're still waiting for data
                    if (isLoading) {
                        return (
                            <Loading />
                        );
                    }

                    let { name, image } = data;

                    return (
                        <figure className="card">
                            <img src={image} alt="" />
                            <figcaption>{name}</figcaption>
                        </figure>
                    );
                }}
            />
        );
    }
}

export default ThingDetails;
