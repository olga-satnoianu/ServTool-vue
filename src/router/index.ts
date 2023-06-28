import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Dashboard.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        layout: "LayoutGuest"
      },
      component: () => import('../views/auth/Login.vue')
    },
    {
      path: "/login-error",
      name: "login-error",
      meta: {
        layout: "LayoutGuest"
      },
      component: () => import("@/views/auth/LoginError.vue"),
    },
    {
      path: '/auth/callback',
      name: 'callback-user',
      meta: {
        layout: "LayoutGuest"
      },
      component: () => import('../views/auth/Callback.vue')
    },
    {
      path: '/auth/callbackGoogle',
      name: 'callback',
      meta: {
        layout: "LayoutGuest"
      },
      component: () => import('../views/auth/CallbackGoogle.vue')
    },
    {
      path: '/domains',
      name: 'domains',
      component: () => import('../views/Domains.vue')
    },
    {
      path: '/servers',
      name: 'servers',
      component: () => import('../views/Servers.vue')
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/Notifications.vue')
    },
    {
      path: '/guidance',
      name: 'guidance',
      component: () => import('../views/Guidance.vue')
    },
    {
      path: '/results',
      name: 'results',
      component: () => import('../views/Results.vue')
    },
    {
      path: '/operations',
      name: 'operations',
      component: () => import('../views/Operations.vue')
    },
    {
      path: '/operation-details',
      name: 'operation-details',
      component: () => import('../views/OperationDetails.vue')
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/Tasks.vue')
    },
  ]
})

export default router
