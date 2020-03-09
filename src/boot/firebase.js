// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from 'firebase/app'

// Add the Firebase services that you want to use
import 'firebase/auth'
import 'firebase/database'

var firebaseConfig = {
  apiKey: 'AIzaSyCLAn0aWM4uwcqVS2AjR9zegSWjPvMdeUs',
  authDomain: 'arkann-e58de.firebaseapp.com',
  databaseURL: 'https://arkann-e58de.firebaseio.com',
  projectId: 'arkann-e58de',
  storageBucket: 'arkann-e58de.appspot.com',
  messagingSenderId: '376035333607',
  appId: '1:376035333607:web:00953d0d4c10b512689942'
}
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig)
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.database()

export { firebaseAuth, firebaseDb }
