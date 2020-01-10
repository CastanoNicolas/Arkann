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
    this.$store.commit('setRootTile', '1553cb4b-f103-4634-8d38-a415e2013e6e')
  }

}
</script>
