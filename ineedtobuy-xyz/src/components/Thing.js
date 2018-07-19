import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class Thing extends Component {
    render() {
        let { match } = this.props;

        return (
            <main className="thing container">
                <h1>iNeedToBuy.xyz</h1>
                <p>A thing with barcode {match.params.barcode}</p>
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

export default Thing;
