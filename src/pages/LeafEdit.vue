<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
    </div>
  </div>
</template>

<script>
export default {
  name: 'name',
  data () {
    return {
    }
  },
  computed: {
    errorCode () {
      return this.$store.state.fileModule.errorCode
    },
    fields () {
      var a = this.$store.state.fileModule.fields
      console.log('Fields:')
      console.log(a)
      return a
    },
    currentTile () {
      var a = this.$store.state.navigationModule.currentTile
      console.log('Current TIle :')
      console.log(a)
      return a
    }
  },
  watch: {
    error (errorCode) {
      if (errorCode === 0) {
        // nothing's wrong
      } else {
        alert(this.$t('error'))
        // code unhandled
      }
    },
    currentTil (currentTile) {
      this.$store.dispatch('getFields', this.currentTile)
    }
  },
  methods: {

  },
  created () {
    console.log('On est dans created')
    console.log(this.currentTile)
    this.$store.dispatch('getFields', this.currentTile)
  }
}
</script>

<style lang="scss" scoped>

</style>
