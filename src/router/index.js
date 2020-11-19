import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

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

    // Navigation Guards
    // http://localhost:8080/destinaton/mexico  // this will not work nowas mexico is not matching
    beforeEnter: (to, from, next) => {
      const exists = store.destinations.find(
        destination => destination.slug === to.params.slug
      )
      if (exists) {
        next()
      } else {
        next({ name: 'notFound' })
      }
    },
  },

  {
    path: '/user',
    name: 'user',
    component: () => import(/* webpackChunkName: "User" */ '../views/User.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "Login" */ '../views/Login.vue'),
  },

  // path: '*' matches any routes / so need to put at the end / the problem is it checks after it loads the path/ so it has possibility to matches
  // thats why we need to use Vue Navigation Guards / like Vue life cycle hooks
  {
    path: '/404',
    alias: '*', // we can directly put * to path / but it shows warning
    name: 'notFound',
    component: () =>
      import(/* webpackChunkName: "NotFound" */ '../views/NotFound.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  linkExactActiveClass: 'vue-router-active-class',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      const position = {}
      if (to.hash) {
        position.selector = to.hash
        if (to.hash === '#experience') {
          position.offset = { y: 140 }
        }
        if (document.querySelector(to.hash)) {
          return position
        }
        return false
      }
    }
  },
  routes,
})

router.beforeEach((to, from, next) => {
  // to.meta.requiresAuth
  // but destination details has child of experience details/ so need to match both, so
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // if not authenticated, push them to login page
    if (!store.user) {
      next({
        name: 'login',
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
