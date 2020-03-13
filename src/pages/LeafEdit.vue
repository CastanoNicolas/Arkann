<template>
  <q-page class="q-pa-md">
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
        <!-- %TODO% Ajuster le temps d'affichage + delais des tooltips (dans un fichier css global pour affecter tous les TT) -->
        <q-btn flat dense icon="save" @click="save">
          <q-tooltip> {{$t('save')}} </q-tooltip>
        </q-btn>
        <!-- %TODO% Message de confirmation -->
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

        <!-- short text -->
        <div
          class="q-pa-sm">
          <div align="right">
            <q-toggle
              dense
              v-model="field.fieldType"
              :label="$t('complexFormatting')"
              left-label/>
            <q-btn dense flat icon="add">
              <q-tooltip>
                {{$t('addReference')}}
              </q-tooltip>
            </q-btn>
            <q-btn flat dense color="grey-7" icon="delete" @click="deleteField(index)">
              <q-tooltip> {{$t('delete')}} </q-tooltip>
            </q-btn>
          </div>
          <q-input dense filled autogrow v-model="field.fieldName"/>
          <!-- %TODO% Ajouter une autre vue si il y a deja une reference :
          afficher la reference en dessous du q-input + le boutton d'ajout à la suite -->
          <q-input  v-if="field.fieldType === false" dense outlined autogrow v-model="field.fieldValue"/>
          <q-editor v-if="field.fieldType === true" dense v-model="field.fieldValue" min-height="5rem">
          </q-editor>
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
        'fieldValue': '',
        'fieldType': false
      }
      if (typeof this.fields.fields === 'object') {
        this.fields.fields.push(newField)
      } else if (typeof this.fields.fields === 'undefined') {
        this.fields.fields = []
        this.fields.fields.push(newField)
      }
    }
  }
}
</script>
