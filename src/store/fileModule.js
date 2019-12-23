import helpers from './helpers/fileModuleHelpers'

export default {
  state: {
    currentTileID: 'lala',
    editing: false,
    filesRead: {},
    cards: [],
    currentWorldPath: './userData/Juko/World1/',
    lookupTable: {},
    cardsTable: {},
    errorCode: 0,
    initialized: false

  },
  mutations: {
    resetCards (state) {
      console.log('reset cards')
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
    }
  },
  actions: {
    init (context) {
      helpers.getFile(helpers.getLookupTablePath(context.state))
        .then(data => {
          context.commit('setLookupTable', JSON.parse(data))
          // context.dispatch('getCards', '1553cb4b-f103-4634-8d38-a415e2013e6e')
        },
        err => {
          console.log(err)
        })
    },
    getCards (context, ID) {
      // %TODO% check if there isn't a safer way to check ID => like if there is a wrong ID what are you doing ?
      var path
      var state = context.state
      context.commit('resetCards')
      if (ID !== null) {
        path = helpers.getFilePathFromID(state, ID)
      } else {
        path = helpers.getFilePathFromID(state, 'rootID')
      }
      console.log(state.lookupTable)
      // %TODO% audit this code quality, it smells ...
      helpers.getFile(path)
        .then(data => {
          var currentTile = JSON.parse(data)
          var childsIDs = currentTile.childs
          for (const childID of childsIDs) {
            helpers.getFile(helpers.getFilePathFromID(state, childID))
              .then(data => {
                var childTile = JSON.parse(data)
                var card = {
                  id: childTile.id,
                  displayName: childTile.displayName,
                  description: childTile.description,
                  category: childTile.category
                }
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
    }
  },
  getters: {
    cards (state) {
      return state.objectToDisplay
    },
    err (state) {
      return state.err
    },
    initialized (state) {
      return state.initialized
    }
  }
}
