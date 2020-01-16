import { Platform } from 'quasar'

const helpers = {

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
  deleteFile (path) {
    try {
      const fs = require('fs')
      fs.unlinkSync(path)
    } catch (err) {
      console.error(err)
    }
  },
  deleteFileById (context, id) {
    // get the file path
    var path = helpers.getFilePathFromId(context.state, id)
    // call helpers.deleteFile(path)
    helpers.deleteFile(path)
  }
}

export default helpers
