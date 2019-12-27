<template>
  <q-page class="q-pa-md">
      <q-toolbar class="bg-grey-4 text-grey-7">
        <q-input
          autogrow
          dense
          :label="$t('Name')"
          v-model="fields.displayName"
          :rules="[val => !!val || $t('RequiredField')]"/>
        <q-space />
        <q-btn flat dense icon="save" color="primary" @click="save"/>
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
    }
  },
  computed: {
    errorCode () {
      return this.$store.state.fileModule.errorCode
    },
    fields () {
      // %TODO% use lodash
      var a = JSON.parse(JSON.stringify(this.$store.state.fileModule.fields))
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
    save () {
      console.log('On sauvegarde')
      this.$store.dispatch('saveFields', this.currentTile, 'lala')
    }
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
