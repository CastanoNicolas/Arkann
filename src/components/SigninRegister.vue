<template>
  <q-form @submit="submitForm()">
    <q-input
    class="q-mb-md"
    outlined
    type="email"
    v-model="formData.email"
    label="Email" />
    <q-input
    class="q-mb-md"
    outlined
    type="password"
    v-model="formData.password"
    :label="$t('password')" />
    <q-input
    v-if="tab == 'register'"
    class="q-mb-md"
    outlined
    type="password"
    v-model="formData.password2"
    :label="$t('confirmPassword')" />
    <div class="row">
      <q-space />
      <q-btn
      type="submit"
      color="primary"
      :label="$t(tab)"
      />
    </div>
  </q-form>
</template>

<script>
export default {
  props: ['tab'],
  data () {
    return {
      formData: {
        email: '',
        password: '',
        password2: ''
      }
    }
  },
  methods: {
    submitForm () {
      if (this.tab === 'register') {
        this.$store.dispatch('registerUser', this.formData)
      } else if (this.tab === 'signin') {
        this.$store.dispatch('signinUser', this.formData)
      }
    }
  }
}
</script>
