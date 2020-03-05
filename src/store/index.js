import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';
import { API } from '@/config/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: null,
    breadcrumb: []
  },
  mutations: {
    setBreadbrumb (state, breadcrumb) {
      state.breadcrumb = breadcrumb;
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo;
    },
    handleExit (state) {
      state.userInfo = null;
      localStorage.removeItem('token');
      localStorage.setItem('redirectUrl', router.currentRoute.fullPath);
      router.push({
        name: 'Login'
      });
    }
  },
  actions: {
    fetchUserInfo ({ commit }, next) {
      $http.get(API.USER_INFO)
        .then(res => {
          commit('setUserInfo', res.data);
          next && next();
        });
    }
  },
  getters: {
    isLogin ({ userInfo }) {
      return !!userInfo;
    }
  },
  modules: {
  }
});
