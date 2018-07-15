import React, { Component } from 'react';
import { FirestoreCollection } from 'react-firestore';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';

class App extends Component {
    render() {
        // TODO make app ask for a token (maybe only when you share it with another?)
        // yeah, so on first run, ask if the user was given a token by another user
        // otherwise, just create a token and store it in localStorage
        let token = 'glory trend mural';

        return (
            <FirestoreCollection
                path={'purchases'}
                filter={['token', '==', token]}
                render={({ isLoading, data }) => {
                    if (data.length < 1) {
                        // TODO make the app do something sensible when there is no data
                        // such as an oboarding flow
                        return <div>First run!</div>;
                    }

                    let { estimates, history } = data[0];

                    return isLoading ? (
                        <div>
                            Loading…
                        </div>
                    ) : (
                        <BrowserRouter>
                            <Switch>
                                <Route path="/" render={() => (
                                    <div>
                                        <h1>iNeedToBuy.xyz</h1>
                                        <p>Live data:</p>
                                        <ul>
                                            <li>History: {history.length}</li>
                                            <li>Estimates: {estimates.length}</li>
                                        </ul>
                                    </div>
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
