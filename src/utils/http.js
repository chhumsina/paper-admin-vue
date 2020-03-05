import axios from 'axios';
import store from '@/store';
import { Message } from 'element-ui';

const config = {
  baseURL: '//localhost:3333'
};

const instance = axios.create(config);

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token || '';
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
  if (response.data.code === -1) {
    Message.closeAll();
    Message.error(response.data.message);
    return Promise.reject(response.data);
  } else if (response.data.code === -1001) { // 未登录
    store.commit('handleExit');
    return Promise.reject(response.data);
  } else if (response.data.code !== 0) {
    return Promise.reject(response.data);
  }
  return response.data;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
