// (C) 2018 SEIKO SOLUTIONS INC.

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store/index.js'
import Moment from 'moment'
import Axios from 'axios'
import ElementUI from 'element-ui'
import '@/assets/css/element-variables.scss'// elementui custom theme
import 'normalize.css'
import 'babel-polyfill'
import '../public/iconfont/material-icons.css'
import locale from 'element-ui/lib/locale/lang/ja'
import AppButton from '@/basics/AppButton'
import '@/assets/css/main.scss'

Vue.config.productionTip = false

Vue.prototype.$moment = Moment
Vue.prototype.$axios = Axios

Vue.use(ElementUI, { locale })

Vue.component('AppButton', AppButton)

// if (window.sessionStorage.getItem('userId')) {
//   store.commit('storeUserId', window.sessionStorage.getItem('userId'))
// }

// (ページ権限を管理する)
// router.beforeEach((to, from, next) => {
//   // to and from are both route objects
//   if(to.meta.isCheck==true){
//     // if (store.state.token&&sessionStorage.getItem('userId')) {
//     if (sessionStorage.getItem('userId')) {
//       next()
//     }
//     else {
//       next({
//           path: '/login',
//           query: {redirect: to.fullPath}
//       })
//     }
//   }else{
//     next()
//   }
// })

const getConfigJson = function () {
  Axios.get('/settings.json').then(res => {
    // Vue.prototype.api_baseURL = res.data.api_baseURL
    Axios.defaults.baseURL = res.data.api_baseURL + '/api/'
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      store,
      components: {
        App
      },
      // template: '<App/>'
      render: h => h(App)
    })
  }).catch(err => console.log(err))
}
getConfigJson()
