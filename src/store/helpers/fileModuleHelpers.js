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
  getFileFromID (state, ID) {
    var path = helpers.getFilePathFromID(state, ID)
    return helpers.getFile(path)
  },
  getFilePathFromID (state, ID) {
    return state.currentWorldPath + state.lookupTable[ID]
  },
  getLookupTablePath (state) {
    return state.currentWorldPath + 'lookupTable.json'
  },
  buildCard (context, data) {
    var childTile = JSON.parse(data)
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
