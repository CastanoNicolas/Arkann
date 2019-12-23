import { Platform } from 'quasar'

const helpers = {
  getFile (path) {
    return new Promise((resolve, reject) => {
      if (Platform.is.electron) {
        try {
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
  getFilePathFromID (state, ID) {
    return state.currentWorldPath + state.lookupTable[ID]
  },
  getLookupTablePath (state) {
    return state.currentWorldPath + 'lookupTable.json'
  }
}

export default helpers
