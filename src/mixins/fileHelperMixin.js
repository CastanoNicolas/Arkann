import { Platform } from 'quasar'

export const fileHelperMixin = {
  methods: {
    getFileFromID (id) {
      // %TODO% CHECK the ID  and check if there isn't a safer way to check ID => like if there is a wrong ID what are you doing ?
      return new Promise((resolve, reject) => {
        if (typeof this.filesRead[id] === 'undefined') {
          var path = this.getFilePathFromID(id)
          this.getFile(path)
            .then(data => {
              // %TODO% check https://medium.com/intrinsic/javascript-prototype-poisoning-vulnerabilities-in-the-wild-7bc15347c96
              this.$store.commit('updateFileCache', {
                'id': id,
                'object': JSON.parse(data)
              })
              resolve(this.filesRead[id])
            },
            error => {
              reject(error)
            })
        } else {
          resolve(this.filesRead[id])
        }
      })
    },
    getFilePathFromID (id) {
      return this.currentWorldPath + this.lookupTable[id]
    },
    getFile (path) {
      return new Promise((resolve, reject) => {
        if (Platform.is.electron) {
          try {
            // %TODO% make a global import
            const fs = require('fs')
            fs.readFile(path, 'utf-8', (error, data) => {
              if (error) {
                reject(error)
              } else {
                resolve(data)
              }
            })
          } catch (error) {
            console.log('Failed to load module "fs"', error)
            throw error
          }
        } else {
          throw new Error('Not yet implemented')
          // https://forum.quasar-framework.org/topic/384/help-loading-local-json-file-in-either-web-or-electron-contexts
        }
      })
    }
  },
  computed: {
    currentWorldPath () {
      return this.$store.state.fileModule.currentWorldPath
    },
    lookupTable () {
      return this.$store.state.fileModule.lookupTable
    },
    filesRead () {
      return this.$store.state.fileModule.filesRead
    }
  }
}
