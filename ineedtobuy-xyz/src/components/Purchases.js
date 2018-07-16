import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Purchases extends Component {
    render() {
        let { estimates, history } = this.props;

        return (
            <main className="purchases container">
                <h1>iNeedToBuy.xyz</h1>
                <p>Live data:</p>
                <ul>
                    <li>History: {history.length}</li>
                    <li>Estimates: {estimates.length}</li>
                </ul>
                <footer>
                    <p>
                        <Link to="/add">
                            Add new thing
                        </Link>
                    </p>
                </footer>
            </main>
        );
    }
}

export default Purchases;
