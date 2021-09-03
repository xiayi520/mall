<template>
  <div class="toast" v-show="isShow">
    <!-- 当添加成功的时候才显示 -->
    <div>{{message}}</div>
  </div>
</template>
<script>
export default {
  name: "Toast",
  props: {
    // 以下属性是让其他组件进行传入到show函数中,所以这里就不需要了
    // message: {
    //   type: String,
    //   default: ''
    // },
    // show: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      message: '',
      isShow: false,
    }
  },
  methods: {
    // duration=2000 默认参数
    show(message = '默认文字', duration=2000) {
      // duration = duration || 2000  es6之前默认参数的写法
      this.isShow = true;
      this.message = message;

      setTimeout(() => {
        this.isShow = false;
        this.message = '';
      },duration)
    }
  }
}
</script>
<style scoped>
  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 10px;
    color: #fff;
    background-color: rgba(0,0,0,.7);
    animation: all .5;
    z-index: 999;
  }
</style>