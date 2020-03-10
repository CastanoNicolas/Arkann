<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select v-model="lang" map-options :options="langs" :label="$t('selectLanguage')"/>
    </div>
  </div>
</template>

<script>
import { fileHelperMixin } from '../mixins/fileHelperMixin'

export default {
  mixins: [fileHelperMixin],
  data () {
    return {
      langs: [
        {
          label: 'English',
          value: 'en-us'
        },
        {
          label: 'Français',
          value: 'fr'
        }
      ],
      lang: this.$i18n.locale
    }
  },
  watch: {
    lang (lang) {
      this.$i18n.locale = lang.value
      // set the quasar's language
      import(`quasar/lang/${lang.value}`).then(language => {
        this.$q.lang.set(language.default)
      })
    }
  },
  created () {
    console.log('created')
    console.log('users/sVsXgqoaZ6cmM3qrA7jxD2wwRA83/worlds/world1/1553cb4b-f103-4634-8d38-a415e2013e6e')
    // this.getServerFile('users/sVsXgqoaZ6cmM3qrA7jxD2wwRA83/worlds/world1/1553cb4b-f103-4634-8d38-a415e2013e6e')
  }
}
</script>
