<template>
  <q-layout view="hHh Lpr lff">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <q-btn
          v-if="loggedIn"
          flat
          dense
          round
          clickable
          to="/auth"
          exact
          icon="person"
        />
        <q-btn
          v-else
          color="white"
          text-color="primary"
          :label="$t('signin')"
          to="/auth"
          />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-scroll-area class="fit">
          <q-list padding>

            <q-item clickable v-ripple to="/" exact>
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>
                {{ $t('home') }}
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/settings" exact>
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>
              <q-item-section>
                {{ $t('settings') }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',
  computed: {
    loggedIn () {
      return this.$store.state.firebaseModule.loggedIn
    }
  },
  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>
