<template>
  <q-page>
    <q-toolbar class="bg-grey-4 text-grey-7 ">
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
      <q-btn flat dense icon="add" @click="createNewLeaf(currentTile)">
        <q-tooltip>
          <!-- %TODO% get the name of the parent tile : create a new [parentTile] -->
          {{$t('newInstanceDescr')}}
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
              class="my-card"
              v-if="card.type === 'branch'">
              <q-card-section class="my-card-body bg-teal text-white justify-between flex"
              @click="changeActiveTile(card.id)">
                <div class="self-end">
                  <div class="text-h6">{{card.displayName}}</div>
                  <div class="text-subtitle2">{{PrettyPrintCat(card.categories)}}</div>
                </div>
                <div class="self-start" align="right">
                  <!-- nombre d'instance -->
                  <div v-if="card.nbInstance > 1">{{card.nbInstance + " " + card.displayName.toLowerCase() + "s"}}</div>
                  <div v-if="card.nbInstance <= 1">{{card.nbInstance + " " + card.displayName.toLowerCase()}}</div>
                   <!-- nombre de sous categorie -->
                  <div v-if="card.nbSubCategories > 1">{{card.nbSubCategories + " " + $t('DaughterCardPl').toLowerCase()}}</div>
                  <div v-if="card.nbSubCategories <= 1">{{card.nbSubCategories + " " + $t('DaughterCard').toLowerCase()}}</div>
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
                <q-btn
                  unelevated
                  color="grey-4"
                  icon="edit"
                  text-color="dark"
                  @click="editBranch(card.id)">
                </q-btn>
              </q-card-actions>
              <!-- END Dropdown -->
            </q-card>
            <!-- END Branch card -->

            <!-- Leaf card -->
            <q-card
              class="my-card"
              v-if="card.type === 'leaf'">
              <!-- %TODO% : afficher une image par defaut ou alors une image upload par l'utilisateur -->
              <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" class="my-card-body">
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
export default {
  name: 'name',
  data () {
    return {
      activeCategory: 'All',
      isDisplayable: []
    }
  },
  computed: {
    errorCode () {
      return this.$store.state.fileModule.errorCode
    },
    cards () {
      // %TODO% see if we can avoid deep copying it and if not use lodash
      var a = JSON.parse(JSON.stringify(this.$store.state.fileModule.cards))
      return a
    },
    canRequestCards () {
      return this.$store.state.fileModule.initialized
    },
    categories () {
      return this.$store.state.fileModule.cardsCategories
    },
    currentTile () {
      return this.$store.state.navigationModule.currentTile
    },
    rootTile () {
      return this.$store.state.navigationModule.rootTile
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
    canRequestCards (canRequestCards) {
      if (this.canRequestCards) {
        this.$store.dispatch('getCards', this.currentTile)
      }
    }
  },
  methods: {
    PrettyPrintCat (categories) {
      var s = ''
      for (const cat of categories) {
        s += ' ' + cat
      }
      return s
    },
    changeActiveTile (id) {
      this.$store.commit('setParentTile', this.currentTile)
      this.$store.commit('setCurrentTile', id)
      this.$store.dispatch('getCards', this.currentTile)
    },
    editLeaf (id) {
      this.$store.commit('setParentTile', this.currentTile)
      this.$store.commit('setCurrentTile', id)
      this.$router.push('/leafEdit')
    },
    createNewLeaf (parentID) {
      // %TODO% faire un import pour as require plusieurs fois
      const newLeafID = require('uuid/v1')()

      this.$store.dispatch('createLeaf', {
        'parentID': parentID,
        'ID': newLeafID
      })
      this.$store.commit('setParentTile', this.$store.state.navigationModule.currentTile)
      this.$store.commit('setCurrentTile', newLeafID)
      this.$router.push('/leafEdit')
    },
    editBranch (id) {
      this.$store.commit('setParentTile', this.currentTile)
      this.$store.commit('setCurrentTile', id)
      this.$router.push('/branchEdit')
    },
    createNewBranch (parentID) {
      const newBranchID = require('uuid/v1')()

      this.$store.dispatch('createBranch', {
        'parentID': parentID,
        'ID': newBranchID
      })
      this.$store.commit('setParentTile', this.$store.state.navigationModule.currentTile)
      this.$store.commit('setCurrentTile', newBranchID)
      this.$router.push('/branchEdit')
    },
    homeMenu () {
      this.changeActiveTile(this.rootTile)
    }
  },
  created () {
    this.$store.commit('setCurrentTile', this.rootTile)
    if (this.canRequestCards) {
      this.$store.dispatch('getCards', this.currentTile)
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
