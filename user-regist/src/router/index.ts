import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/cadastro',
      name: 'registration',
      component: () => import('../views/Registration.vue'),
    },
    {
      path: '/lista-usuarios',
      name: 'listUsers',
      component: () => import('../views/ListUsers.vue'),
    }
  ]
})

export default router
