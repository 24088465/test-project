import { createRouter, createWebHashHistory } from 'vue-router';
import store from '../store'; // import your store

const routes = [
  {
    path: '/',
    component: () => import('@/views/Main.vue'),
    name: 'home1',
    redirect: (to) => {
      const isLoggedIn = store.getters.isAuthenticated;
      const userType = store.state.type;
      if (!isLoggedIn) {
        return '/login';
      }
      return userType === 0 ? '/home/SupHome' : '/home/SubHome';
    },
    children: [], // dynamically added routes will go here
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/home/SupHome',
    name: 'supHome',
    component: () => import('@/views/home/SupHome.vue'),
  },
  {
    path: '/home/SubHome',
    name: 'subHome',
    component: () => import('@/views/home/SubHome.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
