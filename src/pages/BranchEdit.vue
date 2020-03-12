<template>
  <q-page class="q-pa-md">
        <!-- <p>{{fields.length}}</p> -->
      <q-toolbar class="bg-grey-4 text-grey-7">
        <q-btn
        flat
        stretch
        style="primary"
        icon="arrow_back"
        @click="previous('edit')"
        />
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
        <q-btn v-if="fields.displayName != ''" flat dense icon="save" @click="save">
          <q-tooltip> {{$t('save')}} </q-tooltip>
        </q-btn>
        <q-btn v-else disabled flat dense icon="save" @click="save">
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
        :key="field.fieldId">
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
import { editMixin } from '../mixins/editMixin'
export default {
  mixins: [editMixin],
  methods: {
    addField () {
      const fieldId = require('uuid/v1')()
      var newField = {
        'fieldId': fieldId,
        'fieldName': '',
        'fieldType': false
      }
      if (typeof this.fields.fields === 'object') {
        this.fields.fields.push(newField)
      } else if (typeof this.fields.fields === 'undefined') {
        this.fields.fields = []
        this.fields.fields.push(newField)
      }
    },
    deleteField (index) {
      this.fields.fields.splice(index, 1)
    }
  }
}
</script>
