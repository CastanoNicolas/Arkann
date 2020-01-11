<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$store.dispatch('init')
    this.$store.dispatch('initNavigationModule')
    this.$store.dispatch('getGlobalCategories')
  }

}
</script>
