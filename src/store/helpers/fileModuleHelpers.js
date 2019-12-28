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
  getFileFromID (state, ID) {
    // %TODO% CHECK the ID  and check if there isn't a safer way to check ID => like if there is a wrong ID what are you doing ?
    return new Promise((resolve, reject) => {
      if (typeof state.filesRead[ID] === 'undefined') {
        var path = helpers.getFilePathFromID(state, ID)
        helpers.getFile(path)
          .then(data => {
            // %TODO% check https://medium.com/intrinsic/javascript-prototype-poisoning-vulnerabilities-in-the-wild-7bc15347c96
            state.filesRead[ID] = JSON.parse(data)
            resolve(state.filesRead[ID])
          },
          error => {
            reject(error)
          })
      } else {
        resolve(state.filesRead[ID])
      }
    })
  },

  saveFileByID (context, ID, tileObject, tileType) {
    // %TODO% CHECK the ID  and check if there isn't a safer way to check ID => like if there is a wrong ID what are you doing ?
    context.commit('updateFileCache', {
      'ID': ID,
      'object': tileObject
    })
    var relativePath = ''
    if (tileType === 'leaf') {
      relativePath += 'tileInstances/'
    } else {
      relativePath += 'tiles/'
    }
    relativePath += ID + '.json'
    // do we need to update the lookupTable ? (if the displayName changed)
    // if (context.state.lookupTable[ID] !== relativePath) {
    //   context.commit('updateLookupTable', {
    //     'ID': ID,
    //     'path': relativePath
    //   })
    //   // update the lookupTableFile
    //   helpers.saveFile(helpers.getLookupTablePath(context.state), JSON.stringify(context.state.lookupTable))
    // }
    return helpers.saveFile(context.state.currentWorldPath + relativePath, JSON.stringify(tileObject))
  },
  getFilePathFromID (state, ID) {
    return state.currentWorldPath + state.lookupTable[ID]
  },
  getLookupTablePath (state) {
    return state.currentWorldPath + 'lookupTable.json'
  },
  buildCard (context, childTile) {
    // build the card object
    var card = {
      id: childTile.id,
      displayName: childTile.displayName,
      type: childTile.type,
      categories: childTile.categories,
      isDisplayable: true
    }
    // add fields if it is a 'branch'
    if (childTile.type === 'branch') {
      card.nbInstance = childTile.nbInstance
      card.nbSubCategories = childTile.nbSubCategories
    }
    // build an array of the categories encountered to sort tiles afterwards
    for (const cat of childTile.categories) {
      var toBeInserted = {
        label: cat,
        value: cat
      }
      if (!(context.state.cardsCategories.some(category => category.label === toBeInserted.label))) {
        context.commit('addCategories', toBeInserted)
      }
    }
    return card
  }
}

export default helpers
