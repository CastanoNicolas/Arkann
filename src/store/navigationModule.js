export default {
  state: {
    currentTile: 'root',
    previousUserStates: [],
    rootTile: 'root',
    action: 'browse'
  },
  mutations: {
    // set the currentTile to the root one and reset the previousState
    // %TODO% mettre le get cards la dedans pour eviter de faire appele au get card systematiquement
    resetNavigation (state) {
      state.previousUserStates = []
      state.currentTile = state.rootTile
    },

    // payload : {
    //   'tile': newCurrentTile,
    //   'action': 'browse' || 'view' || 'edit'
    // }
    // set currentTile and action
    setUserState (state, payload) {
      state.currentTile = payload.tile
      state.action = payload.action
    },

    // push a userState onto previousUserStates
    userStatePush (state, userState) {
      state.previousUserStates.push(userState)
    },

    // pop a userState from previousUserStates to set the new userState
    userStatePop (state) {
      if (state.previousUserStates.length > 0) {
        var newUserState = state.previousUserStates.pop()
        state.currentTile = newUserState.tile
        state.action = newUserState.action
      }
    },
    setRootTile (state, ID) {
      state.rootTile = ID
    }
  },
  actions: {
    initNavigationModule (context) {
      context.commit('setRootTile', '1553cb4b-f103-4634-8d38-a415e2013e6e')
      context.commit('resetNavigation')
    },
    /*
      payload : {
        'tile': newCurrentTile,
        'action': 'browse' || 'view' || 'edit'
      }
    changes the current userState after pushing the old one onto previousUserState
      */
    changeUserState (context, payload) {
      var tile = payload.tile
      if (tile !== context.state.currentTile) {
        context.commit('userStatePush', {
          'tile': context.state.currentTile,
          'action': context.state.action
        })
        context.commit('setUserState', payload)
      }
    },
    // browse a tile and save the old userState (through changeUserState)
    browse (context, id) {
      context.dispatch('changeUserState', {
        'tile': id,
        'action': 'browse'
      })
    },
    // edit a tile and save the old userState (through changeUserState)
    edit (context, id) {
      context.dispatch('changeUserState', {
        'tile': id,
        'action': 'edit'
      })
      context.dispatch('getFields', id)
    },
    // view a tile and save the old userState (through changeUserState)
    view (context, id) {
      context.dispatch('changeUserState', {
        'tile': id,
        'action': 'view'
      })
    },
    // change the currentUserState to the previous one and load the right pages accordingly
    previous (context) {
      context.commit('userStatePop')
    }
  },
  getters: {
    currentTile (state) {
      return state.curentTile
    }
  }
}
