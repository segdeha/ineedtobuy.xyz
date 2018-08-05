import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import localForage from 'localforage';
import { withFirestore } from 'react-firestore';
import qs from 'qs';

import AddThing from './components/AddThing';
import FirstRun from './components/FirstRun';
import Purchases from './components/Purchases';
import Thing from './components/Thing';

import getToken from './lib/tokens';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        let tokenValue = '';

        // get token value from query string (share link), if present
        let obj = qs.parse(window.location.search.replace('?', ''));
        if (obj.token && this.isValidToken(obj.token)) {
            tokenValue = obj.token;
        }

        // attempt to get token value from localStorage
        // if we get a token successfully, set state with it
        // if we don't, set state of token to null, which should prompt the app to
        // put the user in a "first run" state
        this.state = {
            token: null,
            tokenValue: tokenValue,
            referral: tokenValue !== ''
        };

        // these are used by the FirstRun component
        this.onChange = this.onChange.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onClear = this.onClear.bind(this);
        this.saveToken = this.saveToken.bind(this);
    }

    isValidToken(token) {
        return /^\w+\s\w+\s\w+$/.test(token);
    }

    componentDidMount() {
        localForage.getItem('intb-token')
            .then(value => {
                if (null !== value) {
                    this.setState({
                        token: value
                    });
                }
            });
    }

    onChange(evt) {
        this.setState({
            tokenValue: evt.target.value
        });
    }

    onNext(evt) {
        let { firestore } = this.props;

        // don't submit the form
        evt.preventDefault();

        let tokenInput = document.querySelector('[name="intb-token"]');
        let tokenValue = tokenInput && tokenInput.value.trim().toLowerCase();

        let manualReferralInput = document.querySelector('[name="intb-manual-referral"]');
        let manualReferralValue = manualReferralInput.value > 0;

        // manual referral without a token
        if (manualReferralValue && !this.isValidToken(tokenValue)) {
            alert('Enter a valid share code and try again.');
        }
        // new user without a token
        else if (!this.isValidToken(tokenValue)) {
            // create new token
            tokenValue = getToken();
            // save new user
            firestore.collection('users')
                .doc()
                .set({
                    display_name: '',
                    email: '',
                    token: tokenValue
                })
                .then(() => {
                    this.saveToken(tokenValue);
                })
                .catch(console.log);
        }
        // returning user on a new device or user with a shared token
        // TODO figure out how to create a new user when needed
        // currently, if you share a token, you end up sharing a user
        else {
            // check whether token exists in the database
            firestore.collection('users')
                .where('token', '==', tokenValue)
                .get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        // if not, alert the user
                        alert('Share code doesn’t exist. Try again.');
                    }
                    else {
                        // if so, continue
                        this.saveToken(tokenValue);
                    }
                })
                .catch(console.log);        }
    }

    onClear(evt) {
        this.setState({
            token: null,
            tokenValue: '',
            referral: false
        });
    }

    saveToken(token) {
        // save token to localStorage
        localForage.setItem('intb-token', token);

        // set state with token value
        this.setState({
            token,
            tokenValue: token
        });
    }

    render() {
        // tokenValue helps us control the text input in FirstRun
        let { token, tokenValue, referral } = this.state;

        // if we have no token to work with, put the user in the onboarding flow
        if (!token) {
             return (
                <BrowserRouter>
                    <Switch>
                        <Route path="/:tldr">
                            <Redirect to="/" />
                        </Route>
                        <Route path="/" render={() => <FirstRun onChange={this.onChange} onNext={this.onNext} onClear={this.onClear} tokenValue={tokenValue} referral={referral} />} />;
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

export default withFirestore(App);
