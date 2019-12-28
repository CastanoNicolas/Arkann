<template>
  <q-page class="q-pa-md">
      <q-toolbar class="bg-grey-4 text-grey-7">
        <div>
          <!-- %TODO% ajuster la taille du q-input avec son contenant -->
          <q-input
            autogrow
            dense
            class="title-input"
            :label="$t('name')"
            v-model="fields.displayName"
            :rules="[val => !!val || $t('requiredField')]"/>
        </div>
        <q-space />
        <!-- Buton -->
        <!-- %TODO% Ajuster le temps d'affichage + delais des tooltips (dans un fichier css global pour affecter tous les TT) -->
        <q-btn flat dense icon="save" @click="save">
          <q-tooltip> {{$t('save')}} </q-tooltip>
        </q-btn>
        <!-- %TODO% Message de confirmation -->
        <!-- Si suppression alors remonté les cartes filles ? -->
        <q-btn flat dense icon="delete">
          <q-tooltip> {{$t('delete')}} </q-tooltip>
        </q-btn>
      </q-toolbar>

      <div
        class="q-gutter-md"
        v-for="field in fields.fields"
        :key="field.fieldName">

        <!-- edit of a question -->
        <div class="q-pa-sm">
          <q-input  dense outlined autogrow v-model="field.fieldName"/>
          <!-- TODO : add traduction  -->
          <q-select dense outlined v-model="field.fieldType"
            :options="['short', 'long']"
            label="Nature du texte" />
        </div>

        <!-- %TODO% : pouvoir modifier les categories de la tuile -->

      </div>
  </q-page>
</template>

<script>
export default {
  name: 'name',
  data () {
    return {
      fields: []
    }
  },
  computed: {
    errorCode () {
      return this.$store.state.fileModule.errorCode
    },
    subCategoryFields () {
      // %TODO% use lodash
      var a = this.$store.state.fileModule.fields
      console.log('Fields:')
      console.log(a)
      return a
    },
    currentTile () {
      var a = this.$store.state.navigationModule.currentTile
      console.log('(computed) : Current Tile :')
      console.log(a)
      return a
    },
    tileExists () {
      return this.$store.state.fileModule.tileExists
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
    currentTile (currentTile) {
      console.log('currentTIle watcher: currentileChanged')
      this.$store.dispatch('getFields', this.currentTile)
    },
    subCategoryFields (subCategoryFields) {
      this.fields = JSON.parse(JSON.stringify(subCategoryFields))
      console.log('subCategoryFields')
    },
    tileExists (tileExists) {
      if (this.tileExists) {
        this.$store.dispatch('getFields', this.currentTile)
      }
    }
  },
  methods: {
    save () {
      this.$store.dispatch('saveFields', {
        'ID': this.currentTile,
        'obj': this.fields
      })
    }
  },
  created () {
    console.log('creation de subCategoryEdit :')
    console.log(this.tileExists)
    if (this.tileExists) {
      this.$store.dispatch('getFields', this.currentTile)
    }
  }
}
</script>

<style lang="scss" scoped>
// @media (min-width: 451px) {
//   .title-input{
//   width: 70vw;
//   }
// }
</style>
