import { firebaseAuth, firebaseDb } from 'boot/firebase'

export default {
  state: {
    loggedIn: false
  },
  mutations: {
    setLoggiedIn (state, loggedIn) {
      state.loggedIn = loggedIn
    }
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
          context.commit('setLoggiedIn', true)
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
    signinUser (context, payload) {
      firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          console.log(payload.email + ' connected')
          context.commit('setLoggiedIn', true)
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    signoutUser (context) {
      firebaseAuth.signOut()
        .then(response => {
          context.commit('setLoggiedIn', false)
          console.log('disconnected')
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    synchronizeFiles (context) {
      console.log('synchronization')
    }
  },
  getters: {

  }
}
