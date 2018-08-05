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
        if (obj.token && /^\w+\s\w+\s\w+$/.test(obj.token)) {
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
        this.saveToken = this.saveToken.bind(this);
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

        let input = document.querySelector('[name="intb-token"]');
        let tokenValue = input && input.value.trim().toLowerCase();

        // new user without a token
        if (!tokenValue || tokenValue.split(' ').length !== 3) {
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
            this.saveToken(tokenValue);
        }
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
                        <Route path="/" render={() => <FirstRun onChange={this.onChange} onNext={this.onNext} tokenValue={tokenValue} referral={referral} />} />;
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
