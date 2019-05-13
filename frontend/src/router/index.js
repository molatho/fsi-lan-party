import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Help from '@/components/Help'
import Meal from '@/components/Meal'

Vue.use(Router)
Vue.use(BootstrapVue)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/help',
      name: 'Help',
      component: Help
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Meal
    }
  ]
})
