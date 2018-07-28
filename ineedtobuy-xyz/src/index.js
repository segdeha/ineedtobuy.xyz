import React from 'react';
import ReactDOM from 'react-dom';

import { fb as firebase } from './lib/firebase.js';
import { FirestoreProvider } from 'react-firestore';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <FirestoreProvider firebase={ firebase }>
        <App />
    </FirestoreProvider>,
    document.getElementById('root')
);

registerServiceWorker();
