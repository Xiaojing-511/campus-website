import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue';
import Notes from '../components/Notes.vue';
import Others from '../components/Others.vue';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
  },
  {
    path: '/main',
    name: 'Main',
    redirect: '/login/home',
    component: () => import(/* webpackChunkName: "Main" */ '../views/Main.vue'),
    children:[
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'notes',
        name: 'Notes',
        component: Notes
      },
      {
        path: 'others',
        name: 'Others',
        component: Others
      },
    ]
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
