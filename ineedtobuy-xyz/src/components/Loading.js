import React, { Component } from 'react';

import Header from './Header';
import Footer from './Footer';

class Loading extends Component {
    render() {
        return (
            <main className="loading full-viewport container">
                <Header />
                <section>
                    <img src="/img/loading.gif" alt="Loading…" />
                </section>
                <Footer current="loading" />
            </main>
        );
    }
}

export default Loading;
