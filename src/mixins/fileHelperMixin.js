// eslint-disable-next-line no-unused-vars
import { firebaseAuth, firebaseDb } from 'boot/firebase'

export const fileHelperMixin = {
  methods: {
    // refactor the getFileFromId method name to getfile
    getFile (filename) {
      return this.getFileFromId(filename)
    },
    getServerFilePathFromId (file) {
      let currentUser = 'sVsXgqoaZ6cmM3qrA7jxD2wwRA83'// firebaseAuth.currentUser.uid
      return 'users/' + currentUser + '/worlds/' + this.currentWorld + '/' + file
    },
    getFileFromId (id) {
      return new Promise((resolve, reject) => {
        if (typeof this.filesRead[id] === 'undefined') {
          var _this = this
          let path = this.getServerFilePathFromId(id)
          var ref = firebaseDb.ref(path)
          ref.on('value', function (snapshot) {
            console.log(snapshot.val())
            _this.$store.commit('updateFileCache', {
              'id': id,
              'object': snapshot.val()
            })
            resolve(_this.filesRead[id])
          }, function (errorObject) {
            console.log('The read failed: ' + errorObject.code)
            reject(errorObject.message)
          })
        } else {
          resolve(this.filesRead[id])
        }
      })
    },
    saveFileById (id, tileObject, tileType) {
      // %TODO% CHECK the id  and check if there isn't a safer way to check id => like if there is a wrong id what are you doing ?
      this.$store.commit('updateFileCache', {
        'id': id,
        'object': tileObject
      })

      // is it a new tile ?
      if (typeof this.filesRead[id] === 'undefined') {
        // the parent needs to get a referencve to this child
        this.getFileFromId(tileObject.parent)
          .then(parentTile => {
            parentTile.childs.push(id)
            this.saveFileById(parentTile.id, parentTile, parentTile.type)
          })
      }
      return this.saveFile(this.getServerFilePathFromId(id), tileObject)
    },
    saveFile (path, object) {
      return new Promise((resolve, reject) => {
        firebaseDb
          .ref(path)
          .set(object)
          .then(resp => {
            resolve()
          })
          .catch(err => {
            console.log(err)
            reject()
          })
      })
    },
    deleteFileById (id) {
      // get the file path
      var path = this.getServerFilePathFromId(id)
      // call deleteFile(path)
      this.deleteFile(path)
    },
    deleteFile (path) {
      return new Promise((resolve, reject) => {
        firebaseDb
          .ref(path)
          .remove()
          .then(resp => {
            resolve()
          })
          .catch(err => {
            console.log(err)
            reject()
          })
      })
    }
  },
  computed: {
    currentWorldPath () {
      return this.$store.state.fileModule.currentWorldPath
    },
    currentWorld () {
      return this.$store.state.fileModule.currentWorld
    },
    lookupTable () {
      return this.$store.state.fileModule.lookupTable
    },
    filesRead () {
      return this.$store.state.fileModule.filesRead
    }
  }
}
