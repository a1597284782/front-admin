import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
    // 创建随机且唯一的 UUID
    sid: ''
  },
  mutations: {
    //
    // 更新 sid
    setSid (state, value) {
      state.sid = value
    }
  },
  actions: {
    //
  },
  modules: {
    user,
    app
  }
})
