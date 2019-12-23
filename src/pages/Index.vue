<template>
  <q-page>
    <q-toolbar class="bg-grey-4 text-grey-7 ">
      <q-btn-toggle
        v-model="activeCategory"
        flat stretch
        toggle-color="primary"
        :options="categories"
      />
      <q-space />
      <q-btn flat stretch dense icon="add"/>
    </q-toolbar>

      <div class="cards row q-pa-md q-gutter-md items-start">
          <div
            v-for="card in cards"
            :key="card.id"
            v-show="card.isDisplayable">

            <q-card
              class="my-card"
              v-if="card.type === 'branch'">
              <q-card-section class="my-card-body bg-teal text-white justify-between flex">
                <div class="self-end">
                  <div class="text-h6">{{card.displayName}}</div>
                  <div class="text-subtitle2">{{PrettyPrintCat(card.category)}}</div>
                </div>
                <div class="self-start" align="right">
                  <!-- nombre d'instance -->
                  <div v-if="card.nbInstance > 1">{{card.nbInstance + " " + card.displayName.toLowerCase() + "s"}}</div>
                  <div v-if="card.nbInstance <= 1">{{card.nbInstance + " " + card.displayName.toLowerCase()}}</div>
                   <!-- nombre de sous categorie -->
                  <div v-if="card.nbSubCategory > 1">{{card.nbSubCategory + " " + $t('DaughterCardPl').toLowerCase()}}</div>
                  <div v-if="card.nbSubCategory <= 1">{{card.nbSubCategory + " " + $t('DaughterCard').toLowerCase()}}</div>
                </div>
              </q-card-section>

              <q-card-actions class="my-card-button" align="right">
                <q-btn-dropdown
                  unelevated
                  split
                  icon="add"
                  color="grey-4"
                  text-color="dark"
                  @click="onMainClick"
                  >
                  <q-list>
                    <q-item clickable v-close-popup @click="onItemClick">
                      <q-item-section avatar>
                        <q-avatar icon="description" color="primary" text-color="white" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{card.displayName}}</q-item-label>
                        <q-item-label caption>{{ $t('newInstanceDescr') + card.displayName}}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="onItemClick">
                      <q-item-section avatar>
                        <q-avatar icon="account_tree" color="secondary" text-color="white" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ $t('DaughterCard') }}</q-item-label>
                        <q-item-label caption>{{ $t('newDaughterCardDescr') }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-btn
                  unelevated
                  color="grey-4"
                  icon="edit"
                  text-color="dark">
                </q-btn>
              </q-card-actions>
            </q-card>

            <q-card
              class="my-card"
              v-if="card.type === 'leaf'">
              <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" class="my-card-body">
                <div class="absolute-bottom">
                  <div class="text-h6">{{card.displayName}}</div>
                  <div class="text-subtitle2">{{PrettyPrintCat(card.category)}}</div>
                </div>
              </q-img>

              <q-card-actions class="my-card-button" align="right">
                <q-btn
                  unelevated
                  color="grey-4"
                  icon="visibility"
                  text-color="dark">
                </q-btn>
                <q-btn
                  unelevated
                  color="grey-4"
                  icon="edit"
                  text-color="dark">
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
      </div>
  </q-page>
</template>

<script>
import { Platform } from 'quasar'

export default {
  name: 'name',
  data () {
    return {
      activeCategory: 'All',
      lookupTable: {},
      cards: [],
      categories: [
        { label: 'All', value: 'All' }
      ],
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
  watch: {
    activeCategory (activeCategory) {
      for (var i = 0; i < this.cards.length; i++) {
        var card = this.cards[i]
        if ((card.category).some(cat => cat === activeCategory) || activeCategory === 'All') {
          card.isDisplayable = true
        } else {
          card.isDisplayable = false
        }
      }
    }
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
                if (childTile.type === 'leaf') {
                  this.cards.push({
                    id: childTile.id,
                    displayName: childTile.displayName,
                    type: childTile.type,
                    category: childTile.category,
                    isDisplayable: true
                  })
                } else if (childTile.type === 'branch') {
                  this.cards.push({
                    id: childTile.id,
                    displayName: childTile.displayName,
                    type: childTile.type,
                    category: childTile.category,
                    nbInstance: childTile.nbInstance,
                    nbSubCategory: childTile.nbSubCategory,
                    isDisplayable: true
                  })
                }
                for (const cat of childTile.category) {
                  var toBeInserted = {
                    label: cat,
                    value: cat
                  }
                  if (!(this.categories.some(category => (category.label === toBeInserted.label)))) {
                    this.categories.push(toBeInserted)
                  }
                }
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
    },
    onMainClick () {
      // console.log('Clicked on main button')
    },
    onItemClick () {
      // console.log('Clicked on an Item')
    },
    PrettyPrintCat (categories) {
      var s = ''
      for (const cat of categories) {
        s += ' ' + cat
      }
      return s
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
    width: 250px;
  }
}
@media (min-width: 1501px){
  .my-card{
    width: 300px;
  }
}
.my-card-button{
  height: 50px;
}
.my-card-body{
  height: 140px;
}
</style>
