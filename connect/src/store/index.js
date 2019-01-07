// (C) 2018 SEIKO SOLUTIONS INC.

import Vue from 'vue'
import Vuex from 'vuex'

import TZDeal from './modules/tzdeal'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    TZDeal
  }
})

export default store
