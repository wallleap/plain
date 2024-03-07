import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/tags',
    name: 'tags',
    component: () => import('./views/Tags.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/About.vue'),
  },
  {
    path: '/friends',
    name: 'friends',
    component: () => import('./views/Friends.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('./views/Search.vue'),
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
