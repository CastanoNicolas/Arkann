import { firebaseAuth, firebaseDb } from 'boot/firebase'

export default {
  state: {
    loggedIn: false,
    errorMessage: ''
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
      var defaultWorld = {
        'world1': {
          'root': {
            'childs': [],
            'description': '',
            'displayName': '',
            'id': 'root',
            'image': '',
            'nbInstance': '0',
            'nbSubCategories': '0',
            'parent': '',
            'type': 'branch'
          },
          'worldInfo': {
            'author': '',
            'categories': [],
            'universeName': ''
          }
        }
      }
      return new Promise((resolve, reject) => {
        firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
          .then(response => {
            context.commit('setLoggiedIn', true)
            console.log('response:', response)
            let userID = firebaseAuth.currentUser.uid
            firebaseDb.ref('users/' + userID).set({
              email: payload.email,
              worlds: defaultWorld
            })
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    signinUser (context, payload) {
      return new Promise((resolve, reject) => {
        firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
          .then(response => {
            console.log(payload.email + ' connected')
            context.commit('setLoggiedIn', true)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
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
