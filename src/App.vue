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
    this.$store.dispatch('initNavigationModule')
    this.getGlobalCategories()
  }

}
</script>
