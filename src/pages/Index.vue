<template>
  <q-page>
    <q-toolbar class="bg-grey-4 text-grey-7 ">
      <q-btn-toggle
        v-model="activeCategory"
        flat stretch
        toggle-color="primary"
        :options="[
          {label: 'One', value: 'one'},
          {label: 'Two', value: 'two'},
          {label: 'Three', value: 'three'}
        ]"
      />
      <q-space />
      <q-btn flat stretch dense icon="add"/>
    </q-toolbar>

      <div class="cards row q-pa-md q-gutter-md items-start">
          <q-card
            class="my-card"
            v-for="card in cards"
            :key="card.id">
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{card.displayName}}</div>
                <div class="text-subtitle2">{{card.category}}</div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat>Action 3</q-btn>
                <q-btn flat>Action 2</q-btn>
              </q-card-actions>
          </q-card>
      </div>
  </q-page>
</template>

<script>
import { Platform } from 'quasar'

export default {
  name: 'name',
  data () {
    return {
      activeCategory: 'one',
      lookupTable: {},
      cards: [],
      currentWorldPath: './userData/Juko/World1/'
    }
  },
  computed: {
    lookupTablePath: function () {
      return this.currentWorldPath + 'lookupTable.json'
    }
  },
  created () {
    this.getFile(this.lookupTablePath)
      .then(data => {
        this.lookupTable = JSON.parse(data)
        this.getCards('1553cb4b-f103-4634-8d38-a415e2013e6e')
      },
      err => {
        console.log(err)
      })
  },
  methods: {
    getFile (path) {
      return new Promise((resolve, reject) => {
        if (Platform.is.electron) {
          try {
            const fs = require('fs')

            fs.readFile(path, 'utf-8', (error, data) => {
              if (error) {
                reject(error)
              } else {
                resolve(data)
              }
            })
          } catch (error) {
            console.log('Failed to load module "fs"', error)
            throw error
          }
        } else {
          throw new Error('Not yet implemented')
          // https://forum.quasar-framework.org/topic/384/help-loading-local-json-file-in-either-web-or-electron-contexts
        }
      })
    },
    getFilePathFromID (ID) {
      console.log('Looking for' + ID + 'and CRP : lt[ID]' + this.currentWorldPath + ' : ' + this.lookupTable[ID])
      return this.currentWorldPath + this.lookupTable[ID]
    },
    getCards (ID, root = false) {
      // %TODO% check if there insn't a safer way to check ID
      var path
      if (ID !== null) {
        path = this.getFilePathFromID(ID)
      } else {
        path = this.getFilePathFromID('rootID')
      }
      // %TODO% audit this code quality, it smells ...
      this.getFile(path)
        .then(data => {
          console.log(data)
          var currentTile = JSON.parse(data)
          console.log(currentTile)
          var childsIDs = currentTile.childs
          for (const childID of childsIDs) {
            this.getFile(this.getFilePathFromID(childID))
              .then(data => {
                var childTile = JSON.parse(data)
                this.cards.push({
                  id: childTile.id,
                  displayName: childTile.displayName,
                  description: childTile.description,
                  category: childTile.category
                })
              },
              error => {
                console.log(error)
                alert(this.$t('error'))
              })
          }
        },
        error => {
          console.log(error)
          alert(this.$t('error'))
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 470px) {
  .my-card{
    width: 90vw;
    min-width: 200px;
    max-width: 450px;
  }
}
@media (min-width: 471px) and (max-width: 1500px) {
  .my-card{
    width: 200px;
  }
}
@media (min-width: 1501px){
  .my-card{
    width: 300px;
  }
}
</style>
