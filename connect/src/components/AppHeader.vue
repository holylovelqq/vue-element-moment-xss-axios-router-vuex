<!-- (C) 2018 SEIKO SOLUTIONS INC. -->

<template>
  <div>

    <div class="header" :class="{'header--collapse':collapse}">
      <transition name='fade'>
      <i class="material-icons menuicon" v-show="collapse" @click="openMenu">menu</i>
      </transition>
      <!-- <el-input class="header__search" @keyup.enter.native="inputEnter" v-model="hsItem" placeholder="">
      </el-input>
      <i class="material-icons header__searchicon">search</i> -->
      <!-- <i class="material-icons header__account" @click="editAccount">account_circle</i> -->
    </div>
  </div>
</template>
<script>
import eventHub from '@/assets/js/EventHub.js'
import { checkWidth } from '@/assets/js/CommonMethods.js'
export default {
  name: 'TimeHeader',
  data () {
    return {
      hsItem: '',
      collapse: checkWidth() === 'sm' || checkWidth() === 'md'
    }
  },
  methods: {
    openMenu () {
      this.collapse = false
      eventHub.$emit('collapse', this.collapse)
    }
    // inputEnter () {
    //   console.log('u pressed the key of enter')
    // },
    // editAccount () {
    //   this.$message.warning('u pressed account_circle')
    // }
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
<style lang="scss" scoped>
.header{
  position: absolute;
  height: 64px;
  width: auto;
  left: 230px;
  right: 0;
  background-color:$whitebgc;
  box-sizing: border-box;
  box-shadow: $shadow;
  padding-top: 8px;
  -webkit-transition: left .3s ease-in-out;
  -moz-transition: left .3s ease-in-out;
  transition: left .3s ease-in-out;
  z-index: 2001;
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .header__search{
    position: absolute;
    left: 2.5%;
    width: 39%;
    height: 48px;
    -webkit-transition: left .3s ease-in-out;
    -moz-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out;
    /deep/ .el-input__inner{
      height: 48px;
      line-height: 48px;
      background-color: $graybgc;
      padding-left: 50px;
    }
  }
  .header__searchicon{
    position: absolute;
    left: 3.3%;
    top: 20px;
    -webkit-transition: left .3s ease-in-out;
    -moz-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out;
  }
  .header__account{
    position: absolute;
    top: 20px;
    right: 24px;
    cursor: pointer;
  }
  .menuicon{
    position: absolute;
    top: 20px;
    left: 20px;
    cursor: pointer;
  }
}
.header--collapse{
  left: 0;
}
</style>
