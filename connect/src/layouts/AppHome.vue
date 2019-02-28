<!-- (C) 2018 SEIKO SOLUTIONS INC. -->

<template>
  <div class="wrapper">
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <div class="content" :class="{'content--collapse':collapse}">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import eventHub from '@/assets/js/EventHub.js'
import { checkWidth } from '@/assets/js/CommonMethods.js'
export default {
  name: 'HomePage',
  components: {
    AppHeader,
    AppSidebar
  },
  data () {
    return {
      collapse: checkWidth() === 'sm' || checkWidth() === 'md'
    }
  },
  methods: {

  },
  created () {
    eventHub.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  mounted () {

  },
  watch: {

  },
  computed: {

  }
}
</script>
<style lang="scss">
.content{
  position: absolute;
  left: 230px;
  right: 0;
  top: 64px;
  bottom:0;
  width: auto;
  padding: 32px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-transition: left .3s ease-in-out; // sidebarの開閉
  transition: left .3s ease-in-out;
}
.content--collapse{
  left: 0;
}
@include media-query-md() {
  .content{
    left: 0;
  }
}

@include media-query-sm() {
  .content {
    padding: 12px 12px 30px;
  }
}

</style>
