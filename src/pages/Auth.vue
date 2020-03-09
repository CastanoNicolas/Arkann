<template>
  <q-page class="flex q-pa-md">
    <q-card class="full-width">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" :label="$t('login')" />
          <q-tab name="register" :label="$t('register')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login">
            <login-register :tab="tab" />
          </q-tab-panel>

          <q-tab-panel name="register">
            <login-register :tab="tab" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
  </q-page>
</template>

<script>
export default {
  mixins: [],
  components: {
    'login-register': require('components/LoginRegister.vue').default
  },
  data () {
    return {
      tab: 'login'
    }
  },
  methods: {

  }
}
</script>
