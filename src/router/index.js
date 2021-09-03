import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Profile = () => import('../views/profile/Profile')
const Shopcart = () => import('../views/shopcart/Shopcart')
const Detail = () => import('../views/detail/Detail')
// 1、安装插件
Vue.use(VueRouter)

// 2、创建路由对象
const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/shopcart',
    component: Shopcart
  },
  {
    // 动态路由传递参数
    path: '/detail/:iid',
    // path: '/detail',
    component: Detail
  }
]
const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router