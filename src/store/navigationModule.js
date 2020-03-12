export default {
  state: {
    currentTile: 'root',
    previousUserStates: [],
    rootTile: 'root',
    action: 'browse',
    type: 'branch'
  },
  mutations: {
    // set the currentTile to the root one and reset the previousState
    resetNavigation (state) {
      state.previousUserStates = []
      state.currentTile = state.rootTile
      state.type = 'branch'
      state.action = 'browse'
    },

    // payload : {
    //   'tile': newCurrentTile,
    //   'action': 'browse' || 'view' || 'edit'
    //   'type': 'leaf' || 'branch'
    // }
    // set currentTile and action
    setUserState (state, payload) {
      state.currentTile = payload.tile
      state.action = payload.action
      state.type = payload.type
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
        state.type = newUserState.type
      }
    },
    setRootTile (state, id) {
      state.rootTile = id
    }
  },
  actions: {
    initNavigationModule (context) {
      // context.commit('setRootTile', '1553cb4b-f103-4634-8d38-a415e2013e6e')
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
          'action': context.state.action,
          'type': context.state.type
        })
        context.commit('setUserState', payload)
      }
    },
    // browse a tile and save the old userState (through changeUserState)
    // payload = {
    //   'id': tileId,
    //   'type':  'leaf' | 'branch'
    // }
    browse (context, id) {
      context.dispatch('changeUserState', {
        'tile': id,
        'action': 'browse',
        'type': ''
      })
    },
    // edit a tile and save the old userState (through changeUserState)
    // payload = {
    //   'id': tileId,
    //   'type':  'leaf' | 'branch'
    // }
    edit (context, payload) {
      context.dispatch('changeUserState', {
        'tile': payload.id,
        'action': 'edit',
        'type': payload.type
      })
    },
    // view a tile and save the old userState (through changeUserState)
    // payload = {
    //   'id': tileId,
    //   'type':  'leaf' | 'branch'
    // }
    view (context, payload) {
      context.dispatch('changeUserState', {
        'tile': payload.id,
        'action': 'view',
        'type': payload.type
      })
    },
    // change the currentUserState to the previous one and load the right pages accordingly
    previous (context) {
      context.commit('userStatePop')
    }
  },
  getters: {
    currentTile (state) {
      return state.currentTile
    }
  }
}
