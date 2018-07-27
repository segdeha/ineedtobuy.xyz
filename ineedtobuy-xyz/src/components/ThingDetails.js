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

                    return (
                        <ul>
                            <li>{data.id}</li>
                            <li>{data.name}</li>
                        </ul>
                    );
                }}
            />
        );
    }
}

export default ThingDetails;
