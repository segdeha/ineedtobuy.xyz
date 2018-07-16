import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AddThing extends Component {
    render() {
        return (
            <main className="add-thing container">
                <h1>iNeedToBuy.xyz</h1>
                <p>Add a thing</p>
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

export default AddThing;
