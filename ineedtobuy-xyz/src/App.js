import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import AddThing from './components/AddThing';
import FirstRun from './components/FirstRun';
import Purchases from './components/Purchases';
import Thing from './components/Thing';

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
        let tokenValue = input && input.value.trim().toLowerCase();

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
        // tokenValue helps us control the text input in FirstRun
        let { token, tokenValue } = this.state;

        // if we have no token to work with, put the user in the onboarding flow
        if (!token) {
             return (
                <BrowserRouter>
                    <Switch>
                        <Route path="/" render={() => <FirstRun onChange={this.onChange} onNext={this.onNext} tokenValue={tokenValue} />} />;
                    </Switch>
                </BrowserRouter>
             );
        }

        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/thing/:barcode" render={match => <Thing {...match} token={token} />} />
                    <Route path="/add" render={() => <AddThing token={token} />} />
                    <Route path="/" render={() => <Purchases token={token} />} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
