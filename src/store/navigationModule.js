export default {
  state: {
    currentTile: 'root',
    previousTile: '',
    editing: false,
    viewing: false,
    browsing: true
  },
  mutations: {
    setCurrentTIle (state, tile) {
      state.curentTile = tile
    },
    setParentTIle (state, parent) {
      state.curentTile = parent
    },
    setEditing (state) {
      state.editing = true
      state.viewing = false
      state.browsing = false
    },
    setViewing (state) {
      state.viewing = true
      state.editing = false
      state.browsing = false
    },
    setBrowing (state) {
      state.browing = true
      state.editing = false
      state.viewing = false
    }
  },
  actions: {
    previous (context) {
      if (context.state.editing || context.state.viewing) {
        context.commit('setBrowsing')
      } else if (context.state.browing) {
        context.dispatch('getCards', '1553cb4b-f103-4634-8d38-a415e2013e6e', { root: true })
      }
    }
  },
  getters: {
    currentTIle (state, tile) {
      return state.curentTile
    },
    parentTIle (state, parent) {
      return state.curentTile
    },
    editing (state) {
      return state.editing
    },
    viewing (state) {
      return state.viewing
    },
    browing (state) {
      return state.browing
    }
  }
}
