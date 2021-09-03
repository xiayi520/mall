<template>
  <div class="goods-item" @click="itemClick">
    <!-- 在Vue中，通过load可以直接监听图片加载是否完成 -->
    <img :src="showImage" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    showImage() {
      return this.goodsItem.image || this.goodsItem.show.img
    }
  },
  methods: {
    imageLoad() {
      // 首页商品展示和详情页的推荐商品展示是共用同一个GoodsListItem，首页和详情页监听图片的加载是两个不同的页面，
      // 所以这里就存在一个问题？当详情页的图片加载时，也会发送事件给首页，但是首页并不需要监听详情页图片的加载
      // 解决方法：①、通过路由作判断，不同路径发送不同事件;
      // 事件总线 $bus
      // if(this.$route.path.indexOf('/home')) {
      //   this.$bus.$emit('homeItemImageLoad')
      // } else if (this.$route.path.indexOf('/detail')) {
      //   this.$bus.$emit('detailItemIamgeLoad')
      // }
      // 解决方法二：详情页和首页都传同一个事件，在首页当跳转到详情页的时候,取消首页对图片的监听，但是详情页还可以监听
      this.$bus.$emit('itemImageLoad')
    },
    itemClick() {
      // console.log(this.goodsItem)
      // 动态路由传递参数： 路径加要传递的ID
      this.$router.push('/detail/' + this.goodsItem.iid);
      // 通过query传递参数
      // this.$router.push({
      //   path: '/detail',
      //   query: {

      //   }
      // })
    }
  }
}
</script>
<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;
  width: 48%;
}
.goods-item img {
  width: 100%;
  border-radius: 5px;
}
.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}
.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}
.goods-info .price {
  color: var(--color-hight-text);
  margin-right: 20px
}
.goods-info .collect {
  position: relative;
}
.goods-info .collect::before {
  content: '';
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/favor.png") 0 0/14px 14px;
}
</style>