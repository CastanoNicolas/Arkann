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
        <!-- %TODO% Ajuster le temps d'affichage + delais des tooltips (dans un fichier css global pour affecter tous les TT) -->
        <q-btn flat dense icon="edit">
          <q-tooltip> {{$t('editForm')}} </q-tooltip>
        </q-btn>
        <q-btn flat dense icon="save" @click="save">
          <q-tooltip> {{$t('save')}} </q-tooltip>
        </q-btn>
        <!-- %TODO% Message de confirmation -->
        <q-btn flat dense icon="delete">
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
        v-for="field in fields.fields"
        :key="field.fieldName">

        <!-- short text -->
        <div
          class="q-pa-sm"
          v-if="field.fieldType === false">
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
          v-if="field.fieldType === true">
          <div class="text">{{field.fieldName}}</div>
          <!-- %TODO% :-->
          <!-- Add more options, like list ? -->
          <!-- Add a way to add references + display them -->
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
      fields: [],
      filterOptions: this.globalCategories
    }
  },
  computed: {
    errorCode () {
      return this.$store.state.fileModule.errorCode
    },
    leafFields () {
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
    },
    globalCategories () {
      return this.$store.state.fileModule.globalCategories
    }
  },
  watch: {
    currentTile (currentTile) {
      this.$store.dispatch('getFields', this.currentTile)
    },
    leafFields (leafFields) {
      this.fields = JSON.parse(JSON.stringify(leafFields))
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
          this.filterOptions = this.globalCategories
        } else {
          const needle = val.toLowerCase()
          this.filterOptions = this.globalCategories.filter(
            v => v.toLowerCase().indexOf(needle) > -1
          )
        }
      })
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
