import { createRouter, createWebHistory } from 'vue-router';
import BeanSummary from '@/components/BeanSummary.vue';
import BeanDetails from '@/components/BeanDetails.vue';

const routes = [
	{ path: '/', component: BeanSummary },
	{ path: '/details/:beanId', component: BeanDetails },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
