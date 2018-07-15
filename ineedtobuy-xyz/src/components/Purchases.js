import React, { Component } from 'react';

class Purchases extends Component {
    render() {
        let { estimates, history } = this.props;

        return (
            <main>
                <h1>iNeedToBuy.xyz</h1>
                <p>Live data:</p>
                <ul>
                    <li>History: {history.length}</li>
                    <li>Estimates: {estimates.length}</li>
                </ul>
            </main>
        );
    }
}

export default Purchases;
