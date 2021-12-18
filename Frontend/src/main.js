import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import App from './App.vue'
import axios from 'axios'

Vue.use(iView)

Vue.config.productionTip = false

axios.defaults.baseURL = "http://localhost:8080"
Vue.prototype.$axios = axios

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
