import { format } from 'timeago.js';
import dayjs from 'dayjs';
import accounting from 'accounting';

const filters = {
  timeago (time, locale = 'zh_CN') {
    return format(time, locale);
  },
  dayjs (time, format = 'YYYY-MM-DD HH:hh:ss') {
    return dayjs(time).format(format);
  },
  formatNumber (number) {
    return accounting.formatNumber(number);
  }
};

export default {
  install (Vue) {
    for (const [key, value] of Object.entries(filters)) {
      Vue.filter(key, value);
    }
  }
};
