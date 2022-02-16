import { post } from 'services/request';
import { get } from 'services/request';
import { put } from 'services/request';
import { del } from 'services/request';

export function Login(params) {
  return post('login', params);
}

export function getMenus() {
  return get('menus');
}

//用户相关请求
export function Users(method, params, data) {
  let methodObj = {
    get: () => get('users', params),
    post: () => post('users', params, data),
    put: () => put('users' + params, data),
    del: () => del('users' + params),
  };
  return (methodObj[method] && methodObj[method]()) || null;
}

export function Roles(method, params, data) {
  let methodObj = {
    get: () => get('roles', params),
    post: () => post('roles' + params, data),
    put: () => put('roles' + params, data),
    del: () => del('roles' + params),
  };
  return (methodObj[method] && methodObj[method]()) || null;
}

export function Rights(method, params, data) {
  let methodObj = {
    get: () => get('rights' + params),
    // post: () => post('roles', params),
    // put: () => put('roles' + params, data),
    // del: () => del('roles' + params),
  };
  return (methodObj[method] && methodObj[method]()) || null;
}

export function Goods(method, params, data) {
  let methodObj = {
    get: () => get('goods', params),
    post: () => post('goods', params),
    put: () => put('goods' + params, data),
    del: () => del('goods' + params),
  };
  return (methodObj[method] && methodObj[method]()) || null;
}
export function Categories(method, params, data) {
  let methodObj = {
    get: () => get('categories', params),
    post: () => post('categories' + params, data),
    put: () => put('categories' + params, data),
    del: () => del('categories' + params),
  };
  return (methodObj[method] && methodObj[method]()) || null;
}

export function Orders(method, params, data) {
  let methodObj = {
    get: () => get('orders', params),
    put: () => put('orders' + params, data),
  };
  return (methodObj[method] && methodObj[method]()) || null;
}

export function Kuaidi(method, params, data) {
  let methodObj = {
    get: () => get('kuaidi' + params),
  };
  return (methodObj[method] && methodObj[method]()) || null;
}

export function Reports(method, params, data) {
  let methodObj = {
    get: () => get('reports/type/1', params),
  };
  return (methodObj[method] && methodObj[method]()) || null;
}
