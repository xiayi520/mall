// vuex的使用
import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

// 1、安装vuex
Vue.use(Vuex)
// 2、创建store对象
const store = new Vuex.Store({
  getters,
  state: {
    // 保存添加商品的数据
    cartList: []
  },
  mutations: {
    addCart(state,payload) {
      // 决定购物车商品是否选中
      payload.checked = true //默认选中

      // payload新添加的商品
      // 要判断购物车里是否有改商品，如果有，在点击”添加到购物车“只是该商品数量增加，而不是该商品增加
      // 根据商品id进行判断
      // let oldProduct = null;
      // for(let item of state.cartList) {
      //   if(item.iid === payload.iid) {
      //     oldProduct = item
      //   }
      // }
      // 查找之前数组中是否有该商品
      let oldProduct = state.cartList.find(item => item.iid === payload.iid)
      // 判断oldProduct是否有值
      if(oldProduct) {
        oldProduct.count += 1
      } else {
        payload.count = 1
        state.cartList.push(payload)
      }
      // if(oldProduct) {
      //   oldProduct.count += 1
      // } else {
      //   payload.count = 1
      //   state.cartList.push(payload)
      // }
      
    } 
  },
  actions: {
    // actions里面的参数是context
    addCart(context,payload) {
        // 决定购物车商品是否选中
        payload.checked = true //默认选中
      // actions可以返回Promise
      return new Promise((resolve, reject) => {
        let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      // 判断oldProduct是否有值
       if(oldProduct) {  // 数量增加
         oldProduct.count += 1
         resolve('当前商品数量加1')
       } else { //添加新商品
          payload.count = 1
        context.state.cartList.push(payload)
        resolve('添加了新商品')
      }
      })
    }
  }
})
// 3、挂载Vue实例
export default store