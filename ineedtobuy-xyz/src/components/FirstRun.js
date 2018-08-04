import React, { Component } from 'react';

import Header from './Header';

class FirstRun extends Component {
    render() {
        let { onChange, onNext, tokenValue } = this.props;

        return (
            <main className="first-run full-viewport container">
                <Header />
                <section>
                    <form className="card" onSubmit={onNext}>
                        <h1>Welcome to iNeedToBuy.xyz!</h1>
                        <p>Have a token? Add it below. Otherwise, click “Next” to get started.</p>
                        <label>
                            <input type="text" name="intb-token" onChange={onChange} value={tokenValue} required placeholder="Token" autoCapitalize="none" />
                        </label>
                        <p>
                            <button onClick={onNext}>Next</button>
                        </p>
                    </form>
                </section>
            </main>
        );
    }
}

export default FirstRun;
