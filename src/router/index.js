import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue';
import Chat from '../components/Chat.vue';
import Commodity from '../components/Commodity.vue';
import Info from '../components/Info.vue';

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
    redirect: '/main/home',
    component: () => import(/* webpackChunkName: "Main" */ '../views/Main.vue'),
    children:[
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'chat',
        name: 'Chat',
        component: Chat
      },
      {
        path: 'commodity',
        name: 'Commodity',
        component: Commodity
      },
      {
        path: 'info',
        name: 'Info',
        component: Info
      },
    ]
  },
  {
    path:'*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const uid = window.localStorage.getItem('uid');
  if (to.name !== 'Login' && !uid) next({ name: 'Login' })
  else if(to.name == 'Login' && uid ) next({name: 'Home'})
  else next()
})

export default router
