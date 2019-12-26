import helpers from './helpers/fileModuleHelpers'

export default {
  state: {
    cards: [],
    fields: [],
    currentWorldPath: './userData/Juko/World1/',
    lookupTable: {},
    errorCode: 0,
    initialized: false,
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
    addFields (state, tileFields) {
      state.fields = tileFields
      console.log('fields')
      console.log(state.fields)
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
    getFields (context, ID) {
      var state = context.state
      context.commit('resetFields')

      // %TODO% audit this code quality, it smells ...
      helpers.getFileFromID(state, ID)
        .then(data => {
          // %TODO% accept storing files read
          var Tile = JSON.parse(data)
          context.commit('addFields', Tile.fields)
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

      // %TODO% audit this code quality, it smells ...
      helpers.getFileFromID(state, ID)
        .then(data => {
          // %TODO% accept storing files read
          var currentTile = JSON.parse(data)
          var childsIDs = currentTile.childs
          for (const childID of childsIDs) {
            helpers.getFileFromID(state, childID)
              .then(data => {
                var card = helpers.buildCard(context, data)
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
