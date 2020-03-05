import Vue from 'vue';
import _ from 'lodash';
import VueClipboard from 'vue-clipboard2';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/scss/index.scss';
import $http from '@/utils/http';
import * as CONFIG from '@/config';
import filters from '@/utils/filters';

Vue.config.productionTip = false;

window.$http = $http;
window.CONFIG = CONFIG;
window._ = _;

Vue.use(ElementUI);
Vue.use(filters);
Vue.use(VueClipboard);

console.log(filters);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
