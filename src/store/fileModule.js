import helpers from './helpers/fileModuleHelpers'

export default {
  state: {
    currentTileID: 'lala',
    editing: false,
    filesRead: {},
    cards: [],
    currentWorldPath: './userData/Juko/World1/',
    lookupTable: {},
    cardsTable: {}

  },
  mutations: {
    resetCards (state) {
      console.log('reset cards')
      state.cards = []
    },
    addCard (state, card) {
      state.cards.push(card)
    },
    setLookuptable (state, table) {
      state.lookupTable = table
    }
  },
  actions: {
    init (context) {
      helpers.getFile(helpers.getLookupTablePath(context.state))
        .then(data => {
          context.commit('setLookuptable', JSON.parse(data))
          context.dispatch('getCards', '1553cb4b-f103-4634-8d38-a415e2013e6e')
        },
        err => {
          console.log(err)
        })
    },
    getCards (context, ID) {
      // %TODO% check if there isn't a safer way to check ID
      var path
      var state = context.state
      context.commit('resetCards')
      if (ID !== null) {
        path = helpers.getFilePathFromID(state, ID)
      } else {
        path = helpers.getFilePathFromID(state, 'rootID')
      }
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
                alert(this.$t('error'))
              })
          }
        },
        error => {
          console.log(error)
          alert(this.$t('error'))
        })
    }
  },
  getters: {
    cards (state) {
      return state.objectToDisplay
    }
  }
}
