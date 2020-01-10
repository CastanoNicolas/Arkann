export default {
  state: {
    currentTile: 'root',
    previousTiles: [],
    rootTile: 'root',
    previousTile: '',
    editing: false,
    viewing: false,
    browsing: true
  },
  mutations: {
    resetNavigation (state) {
      state.previousTiles = []
      state.currentTile = state.rootTile
    },
    setCurrentTile (state, ID) {
      if (ID !== state.currentTile) {
        state.previousTiles.push(state.currentTile)
        state.currentTile = ID
      }
    },
    setPreviousTile (state) {
      if (state.previousTiles.length > 0) {
        state.currentTile = state.previousTiles.pop()
      }
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
    },
    setRootTile (state, ID) {
      state.rootTile = ID
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
    currentTile (state) {
      return state.curentTile
    },
    previousTiles (state) {
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
