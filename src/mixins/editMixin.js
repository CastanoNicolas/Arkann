import { fileHelperMixin } from './fileHelperMixin'
import { navigationMixin } from './navigationMixin'
import { tileOperationsMixin } from './tileOperationsMixin'

export const editMixin = {
  mixins: [fileHelperMixin, navigationMixin, tileOperationsMixin],
  data () {
    return {
      fields: [],
      filterOptions: this.globalCategories
    }
  },
  computed: {
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
        this.$store.dispatch('getFields', this.currentTile)
      }
    },
    // %TODO% look if the async computed module is usable
    currentTile (currentTile) {
      if (this.tileExists) {
        this.getFields(this.currentTile)
      }
    }
  },
  methods: {
    save () {
      this.saveFields({
        'id': this.currentTile,
        'obj': this.fields
      })
    },
    deleteInstance () {
      this.deleteTile(this.currentTile)
      this.previous()
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
    getFields (id) {
      this.fields = []

      this.getFileFromId(id)
        .then(tile => {
          var obj = {}
          obj.fields = tile.fields
          obj.displayName = tile.displayName
          obj.categories = tile.categories
          this.fields = obj
        },
        error => {
          console.log(error)
        })
    },
    /*
      payload :{
        'id': tileId,
        'obj': fields object
      }
    */
    saveFields (payload) {
      // context.commit('setFields', newFields)
      console.log('saveFields')
      var obj = JSON.parse(JSON.stringify(payload.obj))
      this.getFileFromId(payload.id)
        .then(tile => {
          tile.fields = obj.fields
          tile.displayName = obj.displayName
          tile.categories = obj.categories
          this.saveFileById(payload.id, tile, tile.type)
        },
        error => {
          console.log(error)
        })
    }
  },
  created () {
    if (this.tileExists) {
      this.getFields(this.currentTile)
    }
  }
}
