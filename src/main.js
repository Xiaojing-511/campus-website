import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './css/reset.css'
// import './css/font.css'
import './css/media.css'
import "./api/element";
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
