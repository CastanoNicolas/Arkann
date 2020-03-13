<template>
  <q-page class="q-pa-md">
      <q-toolbar class="bg-grey-4 text-grey-7">
        <q-btn
        flat
        stretch
        style="primary"
        icon="arrow_back"
        @click="previous('view')"
        />
        <div>
           <div class="text-h5">{{fields.displayName}}</div>
        </div>
        <q-space />
        <!-- %TODO% Ajuster le temps d'affichage + delais des tooltips (dans un fichier css global pour affecter tous les TT) -->
        <q-btn flat dense icon="edit" @click="edit">
          <q-tooltip> {{$t('editForm')}} </q-tooltip>
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
        <div class="text-subtitle1">{{$t('categories')}}</div>
        <q-card flat class="bg-grey-4 text-grey-7 q-pa-sm flex items-baseline">
            <div
            v-for="cat in fields.categories"
            :key="cat">
              <div class="text-subtitle2 q-pr-sm q-pl-sm">{{cat}}</div>
            </div>
          </q-card>
      </div>

      <div
        class="q-gutter-md"
        v-for="field in fields.fields"
        :key="field.fieldName">

        <!-- short text -->
        <div
          class="q-pa-sm"
          v-if="field.fieldType === false">
          <!-- %TODO% Ajouter une autre vue si il y a deja une reference :
          afficher la reference en dessous du q-input + le boutton d'ajout à la suite -->
          <!-- %TODO% Sanitize v-html -->
          <div class="text-subtitle1">{{field.fieldName}}</div>
          <q-card flat>
            <q-separator/>
            <q-card-section v-html="field.fieldValue" />
          </q-card>
        </div>

        <!-- long text : editor -->
        <div
          class="q-pa-sm"
          v-if="field.fieldType === true">
          <div class="text-subtitle1">{{field.fieldName}}</div>
          <q-card flat>
            <q-separator/>
            <q-card-section v-html="field.fieldValue" />
          </q-card>
        </div>

      </div>
  </q-page>
</template>

<script>
import { editMixin } from '../mixins/editMixin'
export default {
  mixins: [editMixin],
  methods: {
    edit () {
      console.log(this.currentAction)
      this.$store.dispatch('edit', {
        'id': this.currentTile,
        'type': 'leaf'
      })
      var currentAction = 'view'
      this.pageUpdate(currentAction)
    }
  }
}
</script>
