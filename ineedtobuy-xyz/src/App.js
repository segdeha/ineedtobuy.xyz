import React, { Component } from 'react';
import { FirestoreCollection } from 'react-firestore';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import FirstRun from './components/FirstRun';
import Purchases from './components/Purchases';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        // attempt to get token value from localStorage
        // if we get a token successfully, set state with it
        // if we don't, set state of token to null, which should prompt the app to
        // put the user in a "first run" state
        this.state = {
            token: window.localStorage.getItem('intb-token'),
            tokenValue: ''
        };

        // these are used by the FirstRun component
        this.onChange = this.onChange.bind(this);
        this.onNext = this.onNext.bind(this);
    }

    onChange(evt) {
        this.setState({
            tokenValue: evt.target.value
        });
    }

    onNext(evt) {
        // don't submit the form
        evt.preventDefault();

        let input = document.querySelector('[name="intb-token"]');
        let tokenValue = input && input.value;

        if (!tokenValue || tokenValue.split(' ').length !== 3) {
            // set state with error value
            this.setState({
                error: 'Invalid token'
            });
        }
        else {
            // save token to localStorage
            window.localStorage.setItem('intb-token', tokenValue);

            // set state with token value
            this.setState({
                error: null,
                token: tokenValue,
                tokenValue: ''
            });
        }
    }

    render() {
        // TODO on first run, ask if the user was given a token by another user
        // otherwise, just create a token and store it in localStorage
        // let token = 'glory trend mural';
        let { token } = this.state;

        return (
            <FirestoreCollection
                path={'purchases'}
                filter={['token', '==', token]}
                render={({ isLoading, data }) => {
                    // this helps us control the text input in FirstRun
                    let { tokenValue } = this.state;

                    // if we have no token to work with, put the user
                    // in the onboarding flow
                    if (!token) {
                        return <FirstRun onChange={this.onChange} onNext={this.onNext} tokenValue={tokenValue} />;
                    }

                    if (isLoading) {
                        return (
                            <main>
                                <h1>Loading your purchase history…</h1>
                            </main>
                        );
                    }

                    let { estimates, history } = data.length > 0 && data[0];

                    if (!history) {
                        return (
                            <main>
                                <h1>No purchases yet</h1>
                            </main>
                        );
                    }

                    return (
                        <BrowserRouter>
                            <Switch>
                                <Route path="/" render={() => (
                                    <Purchases estimates={estimates} history={history} />
                                )} />
                            </Switch>
                        </BrowserRouter>
                    );
                }}
            />
        );
    }
}

export default App;
