export default {
  state: {
    currentWorldPath: './userData/Juko/World1/',
    lookupTable: {},
    initialized: true,
    tileExists: true,
    filesRead: {},
    cardsCategories: [
      { label: 'All', value: 'All' }
    ],
    globalCategories: {},
    currentWorld: 'world1'
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
      console.log('resetFields')
    },
    setFields (state, tileFields) {
      state.fields = tileFields
      console.log('setFields')
    },
    setTileExists (state, bool) {
      state.tileExists = bool
    },
    // payload : {
    //  'id': tileId
    //  'object': the tile object
    // }
    updateFileCache (state, payload) {
      state.filesRead[payload.id] = payload.object
    },
    removeFromFileCache (state, id) {
      delete state.filesRead[id]
    },
    updateLookupTable (state, payload) {
      state.lookupTable[payload.id] = payload.path
    },
    removeChildFromParent (state, payload) {
      var childId = payload.id
      var parentId = payload.id
      var childs = state.filesRead[parentId].childs
      childs.splice(childs.indexOf(childId), 1)
    }
  },
  actions: {

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
