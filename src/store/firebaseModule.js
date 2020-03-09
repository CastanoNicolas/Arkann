import { firebaseAuth, firebaseDb } from 'boot/firebase'

export default {
  state: {

  },
  mutations: {

  },
  actions: {

    // payload: {
    //   email: '',
    //   password: '',
    //   password2: ''
    // }
    registerUser (context, payload) {
      firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          console.log('response:', response)
          let userID = firebaseAuth.currentUser.uid
          firebaseDb.ref('users/' + userID).set({
            email: payload.email
          })
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    loginUser (context, payload) {
      firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          console.log(payload.email + ' connected')
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    logoutUser (context) {
      firebaseAuth.signOut()
        .then(response => {
          console.log('disconnected')
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  },
  getters: {

  }
}
