import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment';
import './css/reset.css'
// import './css/font.css'
import './css/media.css'
import "./api/element";
moment.locale('zh-cn');
Vue.prototype.$moment = moment;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
