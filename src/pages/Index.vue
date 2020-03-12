<template>
  <q-page>
    <q-toolbar class="bg-grey-4 text-grey-7 ">
      <q-btn
        flat
        stretch
        style="primary"
        icon="arrow_back"
        @click="previous('browse')"
        />
        <q-btn
        flat
        stretch
        style="primary"
        icon="home"
        @click="homeMenu"
        />
      <q-btn-toggle
        v-model="activeCategory"
        flat stretch
        toggle-color="primary"
        :options="categories"
      />
      <q-space />
      <q-btn flat dense icon="add" @click="createNewBranch(currentTile)">
        <q-tooltip>
          <!-- %TODO% get the name of the parent tile : create a new [parent Tile] -->
          {{$t('newCategory')}}
        </q-tooltip>
      </q-btn>
    </q-toolbar>
      <div class="cards row q-pa-md q-gutter-md items-start">
          <div
            v-for="card in cards"
            :key="card.id"
            v-show="card.isDisplayable">

            <!-- Branch card -->
            <q-card
              class="my-card-length"
              v-if="card.type === 'branch'">
              <q-card-section class="my-card-body bg-teal text-white justify-between flex"
              @click="changeActiveTile(card.id)">
                <div class="my-card-length" align="right">
                  <!-- nombre d'instance -->
                  <div class="no-overflow" v-if="card.nbInstance > 1">{{card.nbInstance + " " + card.displayName.toLowerCase() + "s"}}</div>
                  <div class="no-overflow" v-if="card.nbInstance <= 1">{{card.nbInstance + " " + card.displayName.toLowerCase()}}</div>
                   <!-- nombre de sous categorie -->
                  <div class="no-overflow" v-if="card.nbSubCategories > 1">{{card.nbSubCategories + " " + $t('DaughterCardPl').toLowerCase()}}</div>
                  <div class="no-overflow" v-if="card.nbSubCategories <= 1">{{card.nbSubCategories + " " + $t('DaughterCard').toLowerCase()}}</div>
                </div>
                <div class="my-card-length">
                  <div class="text-h6 no-overflow">{{card.displayName}}</div>
                  <div class="text-subtitle2 no-overflow">{{PrettyPrintCat(card.categories)}}</div>
                </div>
              </q-card-section>

              <!-- Dropdown Button -->
              <q-card-actions class="my-card-button" align="right">
                <q-btn-dropdown
                  unelevated
                  split
                  icon="add"
                  color="grey-4"
                  text-color="dark"
                  @click="createNewLeaf(card.id)"
                  >
                  <q-list>
                    <q-item clickable v-close-popup @click="createNewLeaf(card.id)">
                      <q-item-section avatar>
                        <q-avatar icon="description" color="primary" text-color="white" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{card.displayName}}</q-item-label>
                        <q-item-label caption>{{ $t('newInstanceDescr') + card.displayName}}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="createNewBranch(card.id)">
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
                <!-- END Dropdown -->
                <q-btn
                  unelevated
                  color="grey-4"
                  icon="edit"
                  text-color="dark"
                  @click="editBranch(card.id)">
                </q-btn>
              </q-card-actions>
            </q-card>
            <!-- END Branch card -->

            <!-- Leaf card -->
            <q-card
              class="my-card-length"
              v-if="card.type === 'leaf'">
              <!-- %TODO% : afficher une image par defaut ou alors une image upload par l'utilisateur -->
              <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" class="my-card-body"
                @click="viewLeaf(card.id)">
                <div class="absolute-bottom">
                  <div class="text-h6">{{card.displayName}}</div>
                  <div class="text-subtitle2">{{PrettyPrintCat(card.categories)}}</div>
                </div>
              </q-img>

              <q-card-actions class="my-card-button" align="right">
                <q-btn
                  unelevated
                  color="grey-4"
                  icon="visibility"
                  @click="viewLeaf(card.id)"
                  text-color="dark">
                </q-btn>
                <q-btn
                  unelevated
                  color="grey-4"
                  icon="edit"
                  text-color="dark"
                  @click="editLeaf(card.id)">
                </q-btn>
              </q-card-actions>
            </q-card>
            <!-- END Leaf card -->
          </div>
      </div>
  </q-page>
</template>

<script>
import { fileHelperMixin } from '../mixins/fileHelperMixin'
import { navigationMixin } from '../mixins/navigationMixin'
import { tileOperationsMixin } from '../mixins/tileOperationsMixin'

export default {
  name: 'name',
  mixins: [fileHelperMixin, navigationMixin, tileOperationsMixin],
  data () {
    return {
      activeCategory: 'All',
      isDisplayable: [],
      cards: [],
      cardsCategories: [
        { label: 'All', value: 'All' }
      ]
    }
  },
  computed: {
    canRequestCards () {
      return this.$store.state.fileModule.initialized
    },
    categories () {
      return this.cardsCategories
    },
    currentTile () {
      return this.$store.state.navigationModule.currentTile
    },
    rootTile () {
      return this.$store.state.navigationModule.rootTile
    },
    action () {
      return this.$store.state.navigationModule.action
    }
  },
  watch: {
    activeCategory (activeCategory) {
      // %TODO%  improve
      for (var i = 0; i < this.cards.length; i++) {
        var card = this.cards[i]
        if (card.categories.some(cat => cat === activeCategory) || activeCategory === 'All') {
          card.isDisplayable = true
        } else {
          card.isDisplayable = false
        }
      }
    },
    currentTile (currentTile) {
      if (this.action === 'browse') {
        this.getCards(currentTile)
      }
    }
  },
  methods: {
    PrettyPrintCat (categories) {
      var s = ''
      if (typeof categories !== 'undefined') {
        for (const cat of categories) {
          s += ' ' + cat
        }
      }
      return s
    },
    changeActiveTile (id) {
      this.$store.dispatch('browse', id)
    },
    viewLeaf (id) {
      this.$store.dispatch('view', {
        'id': id,
        'type': 'leaf'
      })
      var currentAction = 'browse'
      this.pageUpdate(currentAction)
    },
    editLeaf (id) {
      this.$store.dispatch('edit', {
        'id': id,
        'type': 'leaf'
      })
      var currentAction = 'browse'
      this.pageUpdate(currentAction)
    },
    createNewLeaf (parentId) {
      // %TODO% faire un import pour as require plusieurs fois
      const newLeafId = require('uuid/v1')()

      this.createLeaf({
        'parentId': parentId,
        'id': newLeafId
      })

      this.$store.dispatch('edit', {
        'id': newLeafId,
        'type': 'leaf'
      })
      var currentAction = 'browse'
      this.pageUpdate(currentAction)
    },
    editBranch (id) {
      console.log(this.cards)
      this.$store.dispatch('edit', {
        'id': id,
        'type': 'branch'
      })
      var currentAction = 'browse'
      this.pageUpdate(currentAction)
    },
    createNewBranch (parentId) {
      const newBranchId = require('uuid/v1')()

      this.createBranch({
        'parentId': parentId,
        'id': newBranchId
      })
      this.$store.dispatch('edit', {
        'id': newBranchId,
        'type': 'branch'
      })
      var currentAction = 'browse'
      this.pageUpdate(currentAction)
    },
    homeMenu () {
      this.$store.commit('resetNavigation')
    },
    getCards (id) {
      // %TODO% check if there isn't a safer way to check id => like if there is a wrong id what are you doing ?
      this.cards = []
      this.cardsCategories = [
        { label: 'All', value: 'All' }
      ]
      this.getFileFromId(id)
        .then(currentTile => {
          var childsIds
          if (typeof currentTile.childs === 'undefined') {
            childsIds = []
          } else {
            childsIds = currentTile.childs
          }
          for (const childId of childsIds) {
            this.getFileFromId(childId)
              .then(childTile => {
                var card = this.buildCard(childTile)
                // if between the request and the promise resolution the current tile has changed, this child tile shouldn't be displayed
                if (this.currentTile === childTile.parent) {
                  this.cards.push(card)
                }
              },
              error => {
                console.log(error)
              })
          }
        },
        error => {
          console.log(error)
        })
    },
    // childTile is the js object corresponding to the child json file
    buildCard (childTile) {
      // build the card object
      var card = {
        id: childTile.id,
        displayName: childTile.displayName,
        type: childTile.type,
        categories: childTile.categories,
        isDisplayable: true
      }
      // add fields if it is a 'branch'
      if (childTile.type === 'branch') {
        card.nbInstance = childTile.nbInstance
        card.nbSubCategories = childTile.nbSubCategories
      }
      // build an array of the categories encountered to sort tiles afterwards
      if (typeof childTile.categories === 'undefined') {
        childTile.categories = []
        this.cardsCategories = []
      }
      for (const cat of childTile.categories) {
        var toBeInserted = {
          label: cat,
          value: cat
        }
        if (!(this.cardsCategories.some(category => category.label === toBeInserted.label))) {
          this.cardsCategories.push(toBeInserted)
        }
      }
      return card
    }
  },
  created () {
    if (this.canRequestCards) {
      this.getCards(this.currentTile)
    }
  }
}
</script>

<style lang="scss" scoped>
// width of no-overflow must match the card length
@media (max-width: 470px) {
  .my-card-length{
    width: 90vw;
    min-width: 200px;
    max-width: 450px;
  }
  .no-overflow{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
}
@media (min-width: 471px) and (max-width: 1500px) {
  .my-card-length{
    width: 250px;
  }
  .no-overflow{
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
}
@media (min-width: 1501px){
  .my-card-length{
    width: 300px;
  }
  .no-overflow{
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
}
.my-card-button{
  height: 50px;
}
.my-card-body{
  height: 140px;
}
</style>
