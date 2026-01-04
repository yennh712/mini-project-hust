import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import ProductPage from '../components/ProductPage.vue';
import DesignLibrary from '../components/DesignLibrary.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: ProductPage,
    props: true
  },
  {
    path: '/product/custom',
    name: 'CustomProduct',
    component: ProductPage,
    props: { isCustom: true }
  },
  {
    path: '/library',
    name: 'DesignLibrary',
    component: DesignLibrary
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
