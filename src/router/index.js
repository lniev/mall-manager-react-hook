// import Intercept from 'router/intercept'; // 路由拦截
// import Login from 'pages/Login'; //登录
// import App from '../App'; //页面layout
import Users from 'pages/Users';
import Roles from 'pages/Roles';
import Rights from 'pages/Rights';
import Reports from 'pages/Reports';
import Orders from 'pages/Orders';
import Goods from 'pages/Goods'
import AddGoods from 'pages/Goods/AddGoods'
import Categories from 'pages/Categories'
import Params from 'pages/Params'
import Welecome from 'pages/Welecome'
let routes = [
  //  {
  //   path: '/',
  //   com ponent: Intercept,
  //r },
  // {
  //   path: '/home',
  //   component: App,
  //   routes1: [
  //用户管理
  // --
  {
    path: '/home/users',
    exact: true,
    component: Users,
  },

  // 权限管理
  // --
  {
    // 角色列表
    path: '/home/roles',
    exact: true,
    component: Roles,
  },
  {
    // 权限列表
    path: '/home/rights',
    exact: true,
    component: Rights,
  },

  // 商品管理
  // --
  {
    // 商品列表
    path: '/home/goods',
    exact: true,
    component: Goods,
  },
  {
    path: '/home/goods/addGoods',
    exact: true,
    component: AddGoods,
  },
  {
    // 分类参数
    path: '/home/params',
    exact: true,
    component: Params
  },
  {
    // 商品分类
    path: '/home/categories',
    exact: true,
    component: Categories
  },

  // 订单管理
  // --
  {
    // 订单列表
    path: '/home/orders',
    exact: true,
    component: Orders,
  },

  //数据统计
  // --
  {
    // 订单列表
    path: '/home/reports',
    exact: true,
    component: Reports,
  },
  {
    // 欢迎
    path: '/home/welecome',
    exact: true,
    component: Welecome,
  },
];
//   },
//   {
//     path: '/Login',
//     exact: true,
//     component: Login,
//   },
// ];

export default routes;
