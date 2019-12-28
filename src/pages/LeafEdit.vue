<template>
  <q-page class="q-pa-md">
      <q-toolbar class="bg-grey-4 text-grey-7">
        <div>
          <!-- %TODO% ajuster la taille du q-input avec son contenant -->
          <q-input
            autogrow
            dense
            class="title-input"
            :label="$t('Name')"
            v-model="fields.displayName"
            :rules="[val => !!val || $t('RequiredField')]"/>
        </div>
        <q-space />
        <q-btn flat dense icon="edit"/>
        <q-btn flat dense icon="save" @click="save"/>
      </q-toolbar>

      <div
        class="q-gutter-md"
        v-for="field in fields.fields"
        :key="field.fieldName">

        <!-- short text -->
        <div
          class="q-pa-sm"
          v-if="field.fieldType === 'text'">
          <div class="text">{{field.fieldName}}</div>
          <!-- %TODO% Ajouter une autre vue si il y a deja une reference :
          afficher la reference en dessous du q-input + le boutton d'ajout à la suite -->
          <q-input  dense outlined autogrow v-model="field.fieldValue">
            <template v-slot:after v-if="field.fieldReference === ''">
              <q-btn dense flat icon="add">
                <q-tooltip>
                  {{$t('addReference')}}
                </q-tooltip>
              </q-btn>
            </template>
          </q-input>
        </div>

        <!-- long text : editor -->
        <div
          class="q-pa-sm"
          v-if="field.fieldType === 'editor'">
          <div class="text">{{field.fieldName}}</div>
          <!-- %TODO% : attention à l'affichage : sanitized it -->
          <!-- Add more options, like list ? -->
          <q-editor dense v-model="field.fieldValue" min-height="5rem">
          </q-editor>
        </div>

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
    leafFields () {
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
    leafFields (leafFields) {
      this.fields = JSON.parse(JSON.stringify(leafFields))
      console.log('leafFields')
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
    console.log('created de leafEdit :')
    console.log(this.tileExists)
    if (this.tileExists) {
      this.$store.dispatch('getFields', this.currentTile)
    }
  }
}
</script>

<style lang="scss" scoped>
// %TODO% faire grandir le trait avec la taille du texte rempli via JS
// @media (min-width: 451px) {
//   .title-input{
//   width: 70vw;
//   }
// }
</style>
