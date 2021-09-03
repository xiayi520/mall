<template>
  <!-- 封装详情页底部工具栏 -->
  <div class="bottom-bar">
    <div class="bar-item bar-left">
      <div>
        <!-- <img src="~assets/img/detail/service.png" alt="" class="icon service"> -->
        <i class="icon service"></i>
        <span class="text">客服</span>
      </div>
      <div>
        <!-- <img src="~assets/img/detail/shop.png" alt="" class="icon shop"> -->
        <i class="icon shop"></i>
        <span class="text">店铺</span>
      </div>
      <div>
        <!-- <img src="~assets/img/detail/collect.png" alt="" class="icon select"> -->
        <i class="icon select"></i>
        <span class="text">收藏</span>
      </div>
    </div>
    <div class="bar-item bar-right">
      <div class="cart" @click="addToCart">加入购物车</div>
      <div class="buy">购买</div>
    </div>
    <!-- <sport-ball ref="ball" class="sport-ball"></sport-ball> -->
  </div>
</template>
<script>
export default {
  name: "DetailBottomBar",
  methods: {
    addToCart() {
      // console.log('点击添加购物车')
      this.$emit('addCart')
    }
  }
}
</script>
<style scoped>
  .bottom-bar {
    height: 58px;
    background-color: #fff;
    /* 用fixed滚动不了，改为绝对定位 */
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    /* 相对定位也是可以的 */
    /* position: relative; */
    /* bottom: 58px; */
    display: flex;
    text-align: center;
  }
  .bar-item {
    flex: 1;
    display: flex;
  }
  .bar-item>div {
    flex: 1;
  }
  .bar-left .text {
    font-size: 13px;
  }
  .bar-left .icon {
    display: block;
    width: 22px;
    height: 22px;
    margin: 10px auto 3px;
    background: url('~assets/img/detail/detail_bottom.png') 0 0/100%;
  }
  .bar-left .service {
    background-position: 0 -54px;
  }
  .bar-left .shop {
    background-position: 0 -98px;
  }
  .bar-right {
    font-size: 15px;
    color: #fff;
    line-height: 58px;
  }
  .bar-right .cart {
    background-color: #ffe817;
    color: #333;
  }
  .bar-right .buy {
    background-color: #f69;
  }
</style>