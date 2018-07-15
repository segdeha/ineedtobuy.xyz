import React, { Component } from 'react';
import { FirestoreCollection } from 'react-firestore';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';

class App extends Component {
    render() {
        let token = 'glory trend mural';

        return (
            <FirestoreCollection
                path={'purchases'}
                filter={['token', '==', token]}
                render={({ isLoading, data }) => {
                    return isLoading ? (
                        <div>
                            Loading…
                        </div>
                    ) : (
                        <BrowserRouter>
                            <Switch>
                                <Route path="/" render={() => (
                                    <div>
                                        ineedtobuy.xyz
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
