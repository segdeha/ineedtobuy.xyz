import React, { Component } from 'react';

import Header from './Header';
import Footer from './Footer';

class Loading extends Component {
    render() {
        let { token } = this.props;

        return (
            <main className="loading full-viewport container">
                <Header token={token} />
                <section>
                    <img src="/img/loading.gif" alt="Loading…" />
                </section>
                <Footer current="loading" />
            </main>
        );
    }
}

export default Loading;
