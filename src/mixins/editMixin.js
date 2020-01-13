export const editMixin = {
  data () {
    return {
      filterOptions: this.globalCategories
    }
  },
  computed: {
    fields () {
      // %TODO% use lodash
      var a = this.$store.state.fileModule.fields
      console.log('fields is visible')
      console.log(a)
      return JSON.parse(JSON.stringify(a))
    },
    currentTile () {
      var a = this.$store.state.navigationModule.currentTile
      return a
    },
    tileExists () {
      return this.$store.state.fileModule.tileExists
    },
    globalCategories () {
      var a = this.$store.state.fileModule.globalCategories
      console.log('global categories:')
      console.log(a)
      return a
    }
  },
  watch: {
    tileExists (tileExists) {
      if (this.tileExists) {
        console.log('HIIII')
        this.$store.dispatch('getFields', this.currentTile)
      }
    }
  },
  methods: {
    save () {
      console.log(JSON.parse(JSON.stringify(this.fields)))
      this.$store.dispatch('saveFields', {
        'ID': this.currentTile,
        'obj': this.fields
      })
      console.log(JSON.parse(JSON.stringify(this.fields)))
    },
    deleteInstance () {
      this.$store.dispatch('deleteTile', this.currentTile)
      this.$store.dispatch('previous')
    },
    createValue (val, done) {
      if (val.length > 0) {
        done(val, 'add-unique')
      }
    },
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = this.globalCategories
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.globalCategories.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    previous () {
      this.$store.dispatch('previous', this.currentTile)
    }
  }
}
