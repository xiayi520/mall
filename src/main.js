import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// fastclick解决移动端300ms延迟
import FastClick from 'fastclick'

import toast from 'components/common/toast'

Vue.config.productionTip = false
//vue实例可以作为事件总线
Vue.prototype.$bus = new Vue()

// 安装toast插件
// 就会去执行toast里面index里面的install函数
Vue.use(toast)

// 解决移动端300ms延迟
FastClick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
