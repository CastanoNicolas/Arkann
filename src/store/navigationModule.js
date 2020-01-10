export default {
  state: {
    currentTile: 'root',
    parentTile: [],
    rootTile: 'root',
    previousTile: '',
    editing: false,
    viewing: false,
    browsing: true
  },
  mutations: {
    setCurrentTile (state, ID) {
      console.log('Rentre dans set current TIle')
      state.currentTile = ID
      console.log(state.currentTile)
    },
    setParentTile (state, parent) {
      state.parentTile = parent
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
    parentTile (state) {
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
