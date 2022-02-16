import axios from 'axios';
import config from '../common/config.json';

const request = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
});

request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = localStorage.getItem('token');
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    if (response.data.meta.msg === '无效token') {
      localStorage.removeItem('token');
      window.location.replace(window.location.host + '/#/login')
      console.log('跳转了')
    }
    return response.data;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
/**
 *
 * @param {string} url 地址
 * @param {obj} params url后面接的参数
 * @param {obj} data body中的参数
 * @returns Promise
 */
export function get(url, params = {}) {
  return request({ url, params, method: 'get' });
}
export function post(url, data = {}) {
  return request({ url, data, method: 'post' });
}
export function del(url, data = {}) {
  return request({ url, data, method: 'delete' });
}
export function put(url, data = {}) {
  return request({ url, data, method: 'put' });
}
