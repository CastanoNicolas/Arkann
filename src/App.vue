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
    // get all the categories of the current project
    getGlobalCategories () {
      this.$store.commit('resetGlobalCategories')

      this.getFile('worldInfo')
        .then(file => {
          var tab = []
          for (const cat of file.categories) {
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
    // this.initLookupTable()
    // i think we can use a boot file to do just that
    this.$store.dispatch('initNavigationModule')
    this.getGlobalCategories()
  }

}
</script>
