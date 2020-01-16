<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { fileHelperMixin } from './mixins/fileHelperMixin'

export default {
  name: 'App',
  mixins: [fileHelperMixin],
  methods: {
    initLookupTable () {
      this.getFile(this.getLookupTablePath())
        .then(data => {
          this.$store.commit('setLookupTable', JSON.parse(data))
        },
        err => {
          console.log(err)
        })
    },
    getGlobalCategories () {
      // get all the categories of the current project
      this.$store.commit('resetGlobalCategories')

      this.getFile(this.getWorldInfoPath())
        .then(data => {
          var tab = []
          var obj = JSON.parse(data)
          for (const cat of obj.categories) {
            tab.push(cat)
          }
          this.$store.commit('setGlobalCategories', tab)
        },
        error => {
          console.log(error)
        })
    }
  },
  created () {
    this.initLookupTable()
    this.$store.dispatch('initNavigationModule')
    this.getGlobalCategories()
  }

}
</script>
