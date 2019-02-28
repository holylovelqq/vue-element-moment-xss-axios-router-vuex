<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div class="rich-text" v-html="xss(html)"></div>
</template>

<script>
import '@/assets/css/richTextEditorContents.scss'
import { xssSanitizer } from '@/assets/js/CommonMethods.js'
export default {
  name: 'RichText',
  props: {
    html: String
  },
  data () {
    return {
    }
  },
  methods: {
    xss: function (html) {
      return xssSanitizer(html)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
