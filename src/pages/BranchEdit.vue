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
        <q-btn flat dense icon="delete" @click="deleteInstance">
          <q-tooltip> {{$t('delete')}} </q-tooltip>
        </q-btn>
      </q-toolbar>

      <!-- Categories -->
      <!-- %TODO% : liste de toutes les categories existante + ajout d'une nouvelle categorie si création-->
      <!-- %TODO% : sanitize it -->
      <div
        class="q-gutter-md q-pa-sm flex items-baseline"  min-width="0">
        <div class="text">{{$t('categories')}}</div>
        <q-select
          dense
          filled
          v-model="fields.categories"
          use-input
          use-chips
          multiple
          input-debounce="0"
          @new-value="createValue"
          :options="filterOptions"
          @filter="filterFn"
          style="width: 400px"
        />
      </div>

      <div
        class="q-gutter-md"
        v-for="(field, index) in fields.fields"
        :key="field.fieldID">
        <!-- edit of a question -->
        <div class="q-gutter-sm q-pa-sm">
          <q-input  dense outlined autogrow v-model="field.fieldName">
            <template v-slot:after>
              <q-btn flat dense color="grey-7" icon="close" @click="deleteField(index)">
                <q-tooltip> {{$t('delete')}} </q-tooltip>
              </q-btn>
            </template>
          </q-input>
          <!-- TODO : add traduction  -->
          <q-toggle
            dense
            v-model="field.fieldType"
            :label="$t('complexFormatting')"
            left-label/>
        </div>
      </div>

      <q-page-sticky position="bottom-right" :offset="[20, 20]">
        <q-btn fab-mini icon="add" color="primary"
        @click="addField"/>
      </q-page-sticky>
  </q-page>
</template>

<script>
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
export default {
  name: 'name',
  data () {
    return {
      fields: [],
      filterOptions: stringOptions
    }
  },
  computed: {
    errorCode () {
      return this.$store.state.fileModule.errorCode
    },
    branchFields () {
      // %TODO% use lodash
      var a = this.$store.state.fileModule.fields
      return a
    },
    currentTile () {
      var a = this.$store.state.navigationModule.currentTile
      return a
    },
    tileExists () {
      return this.$store.state.fileModule.tileExists
    }
  },
  watch: {
    currentTile (currentTile) {
      this.$store.dispatch('getFields', this.currentTile)
    },
    branchFields (branchFields) {
      this.fields = JSON.parse(JSON.stringify(branchFields))
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
    },
    deleteInstance () {
      this.$store.dispatch('deleteTile', this.currentTile)
      this.$store.commit('setPreviousTile')
      this.$router.push('/')
    },
    createValue (val, done) {
      if (val.length > 0) {
        // if (!stringOptions.includes(val)) {
        //   stringOptions.push(val)
        // }
        done(val, 'add-unique')
      }
    },
    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = stringOptions
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = stringOptions.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    addField () {
      const fieldID = require('uuid/v1')()
      var newField = {
        'fieldID': fieldID,
        'fieldName': '',
        'fieldType': false
      }
      this.fields.fields.push(newField)
    },
    deleteField (index) {
      this.fields.fields.splice(index, 1)
    }
  },
  created () {
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
