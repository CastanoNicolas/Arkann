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
    // %TODO% change were we dispatch this
    this.$store.dispatch('getGlobalCategories')
  }

}
</script>
