export const navigationMixin = {
  methods: {
    previous (currentAction) {
      this.$store.dispatch('previous')
      this.pageUpdate(currentAction)
    },
    pageUpdate (oldAction) {
      if (oldAction !== this.action) {
        if (this.action === 'browse') {
          this.$router.push('/')
          console.log('1')
        } else if (this.action === 'edit') {
          if (this.type === 'branch') {
            this.$router.push('/branchEdit')
            console.log('2')
          } else if (this.type === 'leaf') {
            this.$router.push('/leafEdit')
            console.log('3')
          }
        } else if (this.action === 'view') {
          if (this.type === 'branch') {
            this.$router.push('/branchView')
            console.log('4')
          } else if (this.type === 'leaf') {
            this.$router.push('/leafView')
            console.log('5')
          }
        }
      }
    }
  },
  computed: {
    currentTile () {
      return this.$store.state.navigationModule.currentTile
    },
    action () {
      return this.$store.state.navigationModule.action
    },
    type () {
      return this.$store.state.navigationModule.type
    }
  }
}
