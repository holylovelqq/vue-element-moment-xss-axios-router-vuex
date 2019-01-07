<!-- (C) 2018 SEIKO SOLUTIONS INC. -->

<template>
  <div class="wrapper">
    <time-header></time-header>
    <time-sidebar></time-sidebar>
    <div class="content" :class="{'content--collapse':collapse}">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import TimeHeader from './TimeHeader.vue'
import TimeSidebar from './TimeSidebar.vue'
import eventHub from '../common/EventHub'
export default{
  name: 'HomePage',
  components: {
    TimeHeader,
    TimeSidebar
  },
  data () {
    return {
      collapse: false
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
