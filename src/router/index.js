import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/account',
      name: 'account',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AccountView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/Register.vue'),
    },
    {
      path: '/surveys',
      name: 'surveys',
      component: () => import('../components/Surveys.vue'),
    },
    {
      path: '/create-survey',
      name: 'createSurvey',
      component: () => import('../components/CreateSurvey.vue')
    },
    {
      path: '/survey/:id',
      name: 'theSurvey',
      component: () => import('../views/SurveyView.vue')
    }
  ],
})

export default router
