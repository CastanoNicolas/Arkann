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
      },
      errorMessage: ''
    }
  },
  methods: {
    submitForm () {
      if (this.tab === 'register') {
        if (this.formData.password === this.formData.password2) {
          this.$store.dispatch('registerUser', this.formData)
            .then(() => {
              this.$router.push('/')
            })
            .catch(err => {
              if (err.code === 'auth/invalid-email') {
                this.errorMessage = this.$t('badEmail')
              } else if (err.code === 'auth/email-already-in-use') {
                this.errorMessage = this.$t('emailInUse')
              } else {
                this.errorMessage = this.$t('badEmail')
              }
              console.log(err)
              console.log(this.errorMessage)
            })
        } else {
          console.log('passwords do no match')
          this.errorMessage = this.$t('passwordMatching')
        }
      } else if (this.tab === 'signin') {
        this.$store.dispatch('signinUser', this.formData)
          .then(() => {
            this.$router.push('/')
          })
          .catch(err => {
            this.errorMessage = this.$t('signInError')
            console.log(err)
          })
      }
    }
  }
}
</script>
