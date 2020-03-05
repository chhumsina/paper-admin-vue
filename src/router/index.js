import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const { needLogin } = to.meta;
  if (needLogin && !store.getters.isLogin) {
    store.dispatch('fetchUserInfo', next);
  } else {
    next();
  }
});

export default router;
