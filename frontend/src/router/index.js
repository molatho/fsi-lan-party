import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import About from '@/components/About'
import Pizza from '@/components/Pizza'

Vue.use(Router)

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
      path: '/pizza',
      name: 'Pizza',
      component: Pizza,
      props: this.getHost
    }
  ]
})
