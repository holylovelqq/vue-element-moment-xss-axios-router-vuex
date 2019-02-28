<!-- (C) 2018 SEIKO SOLUTIONS INC. -->

<template>
  <div class="sidebar" :class="{'sidebar--collapse':collapse}">
    <i class="material-icons sidebar__close" @click="closeMenu">arrow_back</i>
    <p class="sidebar__title">connect.TIME</p>
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" active-text-color="#fff" router unique-opened @open="handleOpen" @close="handleClose">
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i class="material-icons">{{item.icon}}</i>
              <span slot="title" style="margin-left: 10px">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem, i) in item.subs" :key="i" :index="subItem.index" style="">
              <!-- <i class="material-icons">{{subItem.icon}}</i> -->
              <span slot="title" style="margin-left: 20px">{{ subItem.title }}</span>
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i class="material-icons">{{item.icon}}</i>
            <span slot="title" style="margin-left: 10px" color="white">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import eventHub from '@/assets/js/EventHub.js'
import { checkWidth } from '@/assets/js/CommonMethods.js'
export default {
  name: 'TimeSidebar',
  data () {
    return {
      collapse: checkWidth() === 'sm' || checkWidth() === 'md',
      items: [
        // {
        //   icon: 'dashboard',
        //   index: '/dashboard',
        //   title: 'ダッシュボード'
        // },
        {
          icon: 'assignment',
          index: '/incident',
          title: 'インシデント'
          // subs: [
          //   {
          //     icon: 'done',
          //     index: '/selfinc',
          //     title: '自分のインシデント'
          //   },
          //   {
          //     icon: 'clear',
          //     index: '/otherinc',
          //     title: '未割当てのインシデント'
          //   }
          // ]
        },
        {
          icon: 'school',
          index: '/knowledge',
          title: 'ナレッジベース'
        }
      ]
    }
  },
  methods: {
    closeMenu () {
      this.collapse = true
      eventHub.$emit('collapse', this.collapse)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
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
    onRoutes () {
      let path = this.$route.path
      let hasKnowledge = path.includes('knowledge')
      let hasIncident = path.includes('incident')
      if (hasKnowledge) {
        return '/knowledge'
      } else if (hasIncident) {
        return '/incident'
      } else {
        return this.$route.path
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar{
  display:block;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 230px;
  -webkit-transition: left .3s ease-in-out;
  -moz-transition: left .3s ease-in-out;
  transition: left .3s ease-in-out;
  background-color: $blackbgc;
  z-index: 2001;
  /deep/ .el-menu-item:focus,
  /deep/ .el-menu-item:hover,
  /deep/ .el-submenu__title:focus,
  /deep/ .el-submenu__title:hover{
    background-color: #364B57;
  }
  /deep/ .el-menu-item.is-active{
    background-color: #3E5460;
  }
  /deep/ .el-menu{
    background-color: $blackbgc;
  }
  /deep/ .el-menu-item i,.el-submenu__title i{
    color:$sidebar-color;
  }
  /deep/ .el-submenu__title, .el-menu-item{
    color:$sidebar-color;
  }
  /deep/ .el-submenu.is-opened{
    .el-submenu__title, .el-menu{
      background-color: #364B57;
    }
    .el-menu-item:focus, .el-menu-item:hover{
      color: #fff;
    }
  }
  /deep/ .el-submenu.is-active{
    .el-submenu__title,.el-submenu__title i:first-child{
      color:#fff;
    }
    .el-submenu__title{
      background-color: #3E5460;
    }
  }
  /deep/ .el-submenu.is-active.is-opened{
    .el-submenu__title, .el-menu{
      background-color: #3E5460;
    }
    .el-submenu__title{
      color:#fff;
    }
    .el-menu-item:focus, .el-menu-item:hover{
      color: #fff;
      background-color: #3E5460;
    }
  }

  .sidebar__close{
    color: #fff;
    position: absolute;
    right: 15px;
    top: 20px;
    cursor: pointer;
    z-index: 1000;
  }
  .sidebar__title{
    font-size: 18px;
    color: #fff;
    // text-align: center;
    position: absolute;
    top: 22px;
    width: 230px;
    font-weight: 700;
    padding-left: 20px;
  }
  .sidebar-el-menu{
    background-color: $blackbgc;
    border-right: none;
    height: 100%;
    margin-top: 64px;
    padding-bottom: 64px;
    overflow-y: auto;
    box-sizing: border-box;
  }
}
.sidebar--collapse{
  left: -230px;
}
</style>
