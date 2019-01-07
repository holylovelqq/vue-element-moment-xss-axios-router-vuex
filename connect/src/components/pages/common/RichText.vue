<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div class="rich-text" v-html="xss(html)"></div>
</template>

<script>
import './RichTextEditorContents.scss'
import { xssSanitizer } from '@/components/pages/common/CommonMethods'
export default{
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
