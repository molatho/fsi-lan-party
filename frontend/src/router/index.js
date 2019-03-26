import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'
import Meal from '@/components/Meal'

Vue.use(Router)
Vue.use(BootstrapVue)

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  props: ['host'],
  methods:{
    getHost: function() {
      return {host: host};
    }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/meals',
      name: 'Meals',
      component: Meal,
      props: this.getHost
    }
  ]
})
