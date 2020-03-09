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
          <q-tab name="signin" :label="$t('signin')" />
          <q-tab name="register" :label="$t('register')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="signin">
            <signin-register :tab="tab" />
          </q-tab-panel>

          <q-tab-panel name="register">
            <signin-register :tab="tab" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
  </q-page>
</template>

<script>
export default {
  mixins: [],
  components: {
    'signin-register': require('components/SigninRegister.vue').default
  },
  data () {
    return {
      tab: 'signin'
    }
  }
}
</script>
