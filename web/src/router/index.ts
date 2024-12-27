import { createRouter, createWebHistory } from 'vue-router';
import BeanSummary from '@/views/BeanSummary.vue';
import BeanDetails from '@/views/BeanDetails.vue';

const routes = [
  { path: '/', component: BeanSummary },
  {
    path: '/details/:beanId',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/BeanDetails.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
