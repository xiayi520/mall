// 插件方式的封装
import Toast from './Toast'
const obj = {}
obj.install = function(Vue) {
  // Vue.prototype.$toast = 对象; 我们希望 "对象" 就是 Toast.vue对象,就在里面定义一个show方法
  // document.body.appendChild(Toast.$el)
  // Vue.prototype.$toast = Toast;  //导入该对象,但是这样的话,Toast里面的内容并没有添加到body里面,所以是不可能显示的,我们可以考虑
                                //通过$el添加到body里面,但是Toast.$el不是节点类型,这样会报错,所以这种方法是不可行的
  // console.log('执行了obj的Install函数',Vue)

  // 1 .创建组件构造器
  const toastContrustor = Vue.extend(Toast)

  // 2 new的方式,根据组件构造器,可以创建出来一个组件对象
  const toast = new toastContrustor()

  // 3 将组件对象手动挂载到某一个元素身上
  toast.$mount(document.createElement('div'))

  // 4  toast.$el对应的就是div
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast;
}


export default obj