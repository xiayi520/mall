<template>
  <!-- 封装scroll -->
  <!-- ref如果是绑定在组件中，那么通过this.$refs.refname获取到的是一个组件对象
       ref如果是绑定在普通元素中，那么通过this.$refs.refname获取到的就是一个元素对象-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  name: "Scroll",
  props: {
    // 不是所有的地方都需要监听滚动的位置，所以probeType不应该写死，应该是设置为一个属性，用户根据需求传入
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  // mounted() {
  //   this.scroll = new BScroll(this.$refs.wrapper, {

  //   })
  // },
  updated() {
    // 1、创建BScroll对象
     this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })
    // this.scroll.scrollTo(0,0)
    // 2、监听滚动的位置
   if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll',(position) => {
      // console.log(position);
      // 把监听滚动事件传出去
      this.$emit('scroll',position)
    })
   }
    // 3、监听scroll滚动到底部
    if(this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
     this.scroll && this.scroll.refresh()
    }
  }
  
}
</script>
<style scoped>

</style>