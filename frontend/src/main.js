// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueGlobalVariable from 'vue-global-var'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import api from './api'

Vue.use(BootstrapVue)
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueGlobalVariable, {
  globals: {
    //api: new api("http://localhost:7777")
      api: new api("")
    }
  });
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})