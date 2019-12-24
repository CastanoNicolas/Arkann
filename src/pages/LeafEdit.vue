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
      fields: {
        displayName: 'Le Monstre'
      }
    }
  },
  computed: {
    errorCode () {
      return this.$store.state.fileModule.errorCode
    }
  },
  watch: {
    activeCategory (activeCategory) {
      // %TODO%  improve
      for (var i = 0; i < this.cards.length; i++) {
        var card = this.cards[i]
        if (card.categories.some(cat => cat === activeCategory) || activeCategory === 'All') {
          card.isDisplayable = true
        } else {
          card.isDisplayable = false
        }
      }
    },
    error (errorCode) {
      if (errorCode === 0) {
        // nothing's wrong
      } else {
        alert(this.$t('error'))
        // code unhandled
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
