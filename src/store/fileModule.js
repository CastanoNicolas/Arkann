import helpers from './helpers/fileModuleHelpers'

export default {
  state: {
    cards: [],
    fields: [],
    currentWorldPath: './userData/Juko/World1/',
    lookupTable: {},
    errorCode: 0,
    initialized: false,
    tileExists: true,
    filesRead: {},
    cardsCategories: [
      { label: 'All', value: 'All' }
    ],
    globalCategories: {}
  },
  mutations: {
    resetCards (state) {
      state.cards = []
    },
    addCard (state, card) {
      state.cards.push(card)
    },
    setLookupTable (state, table) {
      state.lookupTable = table
      state.initialized = true
    },
    setErrorCode (state, errorCode) {
      state.errorCode = errorCode
    },
    resetCategories (state) {
      state.cardsCategories = [
        { label: 'All', value: 'All' }
      ]
    },
    addCategories (state, category) {
      state.cardsCategories.push(category)
    },
    resetGlobalCategories (state) {
      state.globalCategories = {}
    },
    setGlobalCategories (state, globalCategories) {
      state.globalCategories = globalCategories
    },
    resetFields (state) {
      state.fields = []
    },
    setFields (state, tileFields) {
      state.fields = tileFields
    },
    setTileExists (state, bool) {
      state.tileExists = bool
    },
    updateFileCache (state, payload) {
      state.filesRead[payload.ID] = payload.object
    },
    removeFromFileCache (state, ID) {
      state.filesRead.splice(ID, 1)
    },
    updateLookupTable (state, payload) {
      state.lookupTable[payload.ID] = payload.path
    },
    removeChildFromParent (state, payload) {
      var childID = payload.ID
      var parentID = payload.parentID
      var childs = state.filesRead[parentID].childs
      childs.splice(childs.indexOf(childID), 1)
    }
  },
  actions: {
    init (context) {
      helpers.getFile(helpers.getLookupTablePath(context.state))
        .then(data => {
          context.commit('setLookupTable', JSON.parse(data))
        },
        err => {
          console.log(err)
        })
    },
    getFields (context, ID) {
      var state = context.state
      context.commit('resetFields')

      helpers.getFileFromID(state, ID)
        .then(tile => {
          var obj = {}
          obj.fields = tile.fields
          obj.displayName = tile.displayName
          obj.categories = tile.categories
          context.commit('setFields', obj)
        },
        error => {
          console.log(error)
          context.commit('setErrorCode', -1)
        })
    },
    getGlobalCategories (context, ID) {
      // get all the categories of the current project
      context.commit('resetGlobalCategories')

      helpers.getFile(helpers.getWorldInfoPath(context.state))
        .then(data => {
          var tab = []
          var obj = JSON.parse(data)
          for (const cat of obj.categories) {
            tab.push(cat)
          }
          console.log('Lobject')
          console.log(tab)
          context.commit('setGlobalCategories', tab)
        },
        error => {
          console.log(error)
          context.commit('setErrorCode', -1)
        })
    },
    getCards (context, ID) {
      // %TODO% check if there isn't a safer way to check ID => like if there is a wrong ID what are you doing ?
      var state = context.state
      context.commit('resetCards')
      context.commit('resetCategories')

      helpers.getFileFromID(state, ID)
        .then(currentTile => {
          var childsIDs = currentTile.childs
          for (const childID of childsIDs) {
            helpers.getFileFromID(state, childID)
              .then(childTile => {
                var card = helpers.buildCard(context, childTile)
                context.commit('addCard', card)
              },
              error => {
                console.log(error)
                context.commit('setErrorCode', -1)
              })
          }
        },
        error => {
          console.log(error)
          context.commit('setErrorCode', -1)
        })
    },
    saveFields (context, payload) {
      // context.commit('setFields', newFields)
      helpers.getFileFromID(context.state, payload.ID)
        .then(tile => {
          tile.fields = payload.obj.fields
          tile.displayName = payload.obj.displayName
          tile.categories = payload.obj.categories
          helpers.saveFileByID(context, payload.ID, tile, tile.type)
        },
        error => {
          console.log(error)
          context.commit('setErrorCode', -1)
        })
    },
    createLeaf (context, payload) {
      context.commit('setTileExists', false)
      var leafObject = {
        'id': payload.ID,
        'displayName': '',
        'parent': payload.parentID,
        'type': 'leaf',
        'image': '',
        'fields': [],
        'categories': []
      }
      helpers.getFileFromID(context.state, payload.parentID)
        .then(parentTile => {
          // get the fields declared in the parent tile
          for (const parentField of parentTile.fields) {
            var childField = {
              'fieldName': parentField.fieldName,
              'fieldType': parentField.fieldType,
              'fieldValue': '',
              'fieldReference': '',
              'fieldReferenceName': ''
            }
            leafObject.fields.push(childField)
          }
          console.log('parent category')
          console.log(parentTile)
          // categories are inherited from their parent
          for (const parentCategory of parentTile.categories) {
            leafObject.categories.push(parentCategory)
          }

          // information needed when the leaf is saved to know if the parent needs to be updated too
          // leafObject.neverSaved = true

          // update the file cache to be able te load this tile until it is saved
          context.commit('updateFileCache', {
            'ID': payload.ID,
            'object': leafObject
          })
          context.commit('setTileExists', true)
        })
    },
    createBranch (context, payload) {
      context.commit('setTileExists', false)
      var branchObject = {
        'id': payload.ID,
        'displayName': '',
        'parent': payload.parentID,
        'type': 'branch',
        'fields': [],
        'categories': [],
        'childs': [],
        'nbInstance': '0',
        'nbSubCategories': '0'
      }
      helpers.getFileFromID(context.state, payload.parentID)
        .then(parentTile => {
          // get the fields declared in the parent tile
          const uuidv1 = require('uuid/v1')
          for (const parentField of parentTile.fields) {
            var childField = {
              'fieldName': parentField.fieldName,
              'fieldType': parentField.fieldType,
              'fieldID': uuidv1()
            }
            branchObject.fields.push(childField)
          }
          console.log('parent category')
          console.log(parentTile)
          // categories are inherited from their parent
          for (const parentCategory of parentTile.categories) {
            branchObject.categories.push(parentCategory)
          }

          // update the file cache to be able te load this tile until it is saved
          context.commit('updateFileCache', {
            'ID': payload.ID,
            'object': branchObject
          })
          context.commit('setTileExists', true)
        })
    },
    deleteTile (context, payload) {
      context.commit('removeFromFileCache', payload.ID)
      helpers.getFileFromID(context.state, payload.parentID)
        .then(parent => {
          context.commit('removeChildFromParent', payload)
          helpers.saveFileByID(context, parent.ID, parent, parent.type)
          helpers.deleteFileByID(context, payload.ID)
        })
      // supprimer le fichier
    }
  },
  getters: {
    cards (state) {
      return state.cards
    },
    fields (state) {
      return state.fields
    },
    err (state) {
      return state.err
    },
    initialized (state) {
      return state.initialized
    },
    cardsCategories (state) {
      return state.cardsCategories
    },
    globalCategories (state) {
      return state.globalCategories
    }
  }
}
