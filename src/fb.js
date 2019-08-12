import firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyBG_bFzQ4KJwzIcc871F2IVUUaN33e-1w0",
    authDomain: "gastos-6df38.firebaseapp.com",
    databaseURL: "https://gastos-6df38.firebaseio.com",
    projectId: "gastos-6df38",
    storageBucket: "gastos-6df38.appspot.com",
    messagingSenderId: "1028133063894",
    appId: "1:1028133063894:web:0db502bdbf0045e2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;