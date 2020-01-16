export const navigationMixin = {
  data () {
  },
  methods: {
    previous (currentAction) {
      this.$store.dispatch('previous')
      if (currentAction !== this.action) {
        if (this.action === 'browse') {
          this.$router.push('/')
        } else if (this.action === 'edit') {
          this.$router.push('/branchEdit')
        } else if (this.action === 'view') {
          this.$router.push('/branchView')
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
  }
}