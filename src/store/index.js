import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登陆者id
    uid: ''
  },
  mutations: {
    set_uid(state, value) {
      state.uid = value;
    }
  },
  actions: {
    setUid({ commit }, value) {
      commit("set_uid", value)
    }
  },
  modules: {
  },
  getters
})
