import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登陆者id
    uid: '',
    uImgSrc: '',
    uStyleText: ''
  },
  mutations: {
    set_uid(state, value) {
      state.uid = value;
    },
    set_uImgSrc(state, value) {
      state.uImgSrc = value;
    },
    set_uStyleText(state, value) {
      state.uStyleText = value;
    },
  },
  actions: {
    setUid({ commit }, value) {
      commit("set_uid", value)
    },
    setUImgSrc({ commit }, value) {
      commit("set_uImgSrc", value)
    },
    setUStyleText({ commit }, value) {
      commit("set_uStyleText", value)
    },
  },
  modules: {
  },
  getters
})
