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
    ]

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
    resetFields (state) {
      state.fields = []
    },
    setFields (state, tileFields) {
      state.fields = tileFields
    },
    setTileExists (state, bool) {
      state.tileExists = bool
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
          context.commit('setFields', obj)
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
          helpers.saveFileByDisplayName(context.state, payload.ID, tile, tile.displayName)
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

          // categories are inherited from their parent
          for (const parentCategories of parentTile.categories) {
            leafObject.categories.push(parentCategories)
          }
          // update the file cache to be able te load this tile until it is saved
          helpers.updateFileCache(context.state, payload.ID, leafObject)
          context.commit('setTileExists', true)
        })
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
    }
  }
}
