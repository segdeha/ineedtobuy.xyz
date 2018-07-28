// Import the Firebase modules that you need in your app.
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initalize Firebase.
const config = {
    apiKey: 'AIzaSyCTidUicbVBGDBh-B0pDtXfoYDZaMFaxQI',
    authDomain: 'ineedtobuy-xyz.firebaseapp.com',
    databaseURL: 'https://ineedtobuy-xyz.firebaseio.com',
    projectId: 'ineedtobuy-xyz',
    storageBucket: 'ineedtobuy-xyz.appspot.com',
    messagingSenderId: '881163547542'
};

let fb = firebase.initializeApp(config);

// Fix a warning about native Date objects being deprecated
// in favor of Firebase timestamps.
fb.firestore().settings({
    timestampsInSnapshots: true
});

const Timestamp = fb.firebase_.firestore.Timestamp;

export {
    fb,
    Timestamp
};
