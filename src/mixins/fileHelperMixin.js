import { Platform } from 'quasar'

export const fileHelperMixin = {
  methods: {
    getFileFromId (id) {
      // %TODO% CHECK the id  and check if there isn't a safer way to check id => like if there is a wrong id what are you doing ?
      return new Promise((resolve, reject) => {
        if (typeof this.filesRead[id] === 'undefined') {
          var path = this.getFilePathFromId(id)
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
    getFilePathFromId (id) {
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
    },
    saveFileById (id, tileObject, tileType) {
      // %TODO% CHECK the id  and check if there isn't a safer way to check id => like if there is a wrong id what are you doing ?
      this.$store.commit('updateFileCache', {
        'id': id,
        'object': tileObject
      })
      var relativePath = ''
      if (tileType === 'leaf') {
        relativePath += 'tileInstances/'
      } else {
        relativePath += 'tiles/'
      }
      relativePath += id + '.json'
      // do we need to update the lookupTable ? (if this is a new leaf changed)
      if (typeof this.lookupTable[id] === 'undefined') {
        this.$store.commit('updateLookupTable', {
          'id': id,
          'path': relativePath
        })
        // update the lookupTableFile
        this.saveFile(this.getLookupTablePath(), JSON.stringify(this.lookupTable, null, '\t'))

        // the parent needs to get a referencve to this child too
        this.getFileFromId(tileObject.parent)
          .then(parentTile => {
            parentTile.childs.push(id)
            this.saveFileById(parentTile.id, parentTile, parentTile.type)
          })
      }
      return this.saveFile(this.currentWorldPath + relativePath, JSON.stringify(tileObject, null, '\t'))
    },
    saveFile (path, stringFile) {
      return new Promise((resolve, reject) => {
        if (Platform.is.electron) {
          try {
            const fs = require('fs')
            fs.writeFile(path, stringFile, 'utf-8', (error, data) => {
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
    },
    getLookupTablePath () {
      return this.currentWorldPath + 'lookupTable.json'
    },
    getWorldInfoPath () {
      return this.currentWorldPath + 'worldInfo.json'
    },
    deleteFileById (id) {
      // get the file path
      var path = this.getFilePathFromId(id)
      // call deleteFile(path)
      this.deleteFile(path)
    },
    deleteFile (path) {
      try {
        const fs = require('fs')
        fs.unlinkSync(path)
      } catch (err) {
        console.error(err)
      }
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
