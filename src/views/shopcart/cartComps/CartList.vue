<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item) in cartList" :key="item.index" :itemInfo="item"></cart-list-item>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem'

import { mapGetters } from 'vuex'
export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },

  computed: {
    ...mapGetters(['cartList'])
  },
  activated() {
    // 当购物车里面为空时，默认scrollerHeight = 0，当往购物车添加新的数据时，scrollerHeight改变了，但是没有刷新，所以不能滚动
    // 所以当重新进入购物车要重新刷新scrollerHeight，记住要在activated()里面进行刷新
    this.$refs.scroll.refresh()
  }
}
</script>
<style scoped>
.cart-list {
  /* height: 100vh */
   height: calc(100% - 44px - 58px - 40px);
}
  .content {
    /* height: calc(100% - 44px - 58px); */
    height: 100%;
    overflow: hidden;
  }
</style>