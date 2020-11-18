import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // arrow function to dynamically loaading
    // magic comment to see the component loading in Network tab
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
    props: true,
  },
  {
    path: '/destinaton/:slug',
    name: 'DestinationDetails',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "DestinationDetails" */ '../views/DestinationDetails.vue'
      ),
    children: [
      {
        path: ':experienceSlug',
        name: 'experienceDetails',
        props: true,
        component: () =>
          import(
            /* webpackChunkName: "ExperienceDetails" */ '../views/ExperienceDetails.vue'
          ),
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass: 'vue-router-active-class',
  routes,
})

export default router
