<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <!-- @scroll: 监听滚动的位置，实现滚动内容显示对应标题 -->
    <!-- probeType默认0，不监听，如果要监听，设置为3 -->
    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
      <!-- <ul>
        <li v-for="item in $store.state.cartList" :key="item.index">
          {{item}}
        </li>
      </ul> -->
       <detail-swiper :top-images="topImages" />
       <detail-base-info :goodsInfo="goodsInfo" />
       <detail-shop-info :shop="shop" />
       <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad" />
       <detail-param-info :paramInfo="paramInfo" ref="params" />
       <detail-comment-info :commentInfo="commentInfo" ref="comment" />
       <goods-list :goods="recommendData" ref="recommend" />
    </scroll>
    <detail-bottom-bar @addCart="addCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <!-- 注意: 如果是下面这种写法,message前面是不加: -->
    <!-- <toast message="哈哈哈" /> -->
    <!-- <toast :message="message" :show="show" /> -->
  </div>
</template>
<script>
import DetailNavBar from './detailComps/DetailNavBar'
import DetailSwiper from './detailComps/DetailSwiper'
import DetailBaseInfo from './detailComps/DetailBaseInfo'
import DetailShopInfo from './detailComps/DetailShopInfo'
import DetailGoodsInfo from './detailComps/DetailGoodsInfo'
import DetailParamInfo from './detailComps/DetailParamInfo'
import DetailCommentInfo from './detailComps/DetailCommentInfo'
import DetailBottomBar from './detailComps/DetailBottomBar.vue'

// import Toast from 'components/common/toast/Toast'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'

// 为了简化调用store里面actions里面的方法
// 以前使用: this.$store.dispatch('addCart',product).then(res => {console.log(res); })
// 简化为: this.addCart(product).then(res => {})
// 把actions里面的方法映射到 方法里面
// import { mapActions } from 'vuex'

import 
{
  getDetailData, 
  GoodsInfo,
  Shop,
  GoodsParam,
  getRecommendData
} from 'network/detail'

import {debounce} from 'common/utils'
export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    // Toast,
    Scroll,
    GoodsList,
    BackTop
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goodsInfo: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommendData: [],
      detailImgListener: null,
      themeTopY: [],
      // 记录当前index
      currentIndex: 0,
      isShowBackTop: false,
      // message: '',
      // show: false
    }
  },
  created() {
    // 1、保存传入的id
    this.iid = this.$route.params.iid

    // 2、根据iid请求详情页数据
    getDetailData(this.iid).then(res => {
      // console.log(res)
      //(1) 获取顶部轮播图
      const data = res.result
      this.topImages = data.itemInfo.topImages

      // (2)获取商品信息
      // 整合数据
      this.goodsInfo = new GoodsInfo(data.itemInfo,data.columns, data.shopInfo.services)

      // (3)获取商家信息
      this.shop = new Shop(data.shopInfo)
      // (4)获取商品详细信息
      this.detailInfo = data.detailInfo;
      // (5)获取商品参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // (6)获取用户评论信息 ，有些有评论信息，有些没有，所以最好做判断
      if(data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    })
    // 3、请求推荐数据
    getRecommendData().then(res => {
      // console.log(res)
      this.recommendData = res.data.list
    })

    // 第一次获取值不对是因为在created里面this.$refs.params.$el还没有渲染，获取不到值
    //  this.themeTopY = [];
    //   this.themeTopY.push(0);
    //   this.themeTopY.push(this.$refs.params.$el.offsetTop);
    //   this.themeTopY.push(this.$refs.comment.$el.offsetTop);
    //   this.themeTopY.push(this.$refs.recommend.$el.offsetTop);
    //   console.log(this.themeTopY);
    // 当数据全部渲染完之后，会回调$nextTick函数，就可以保证offsetTop能获取到值
    // this.$nextTick(() => {
    //   // 根据最新的数据，对应的DOM已经被渲染出来，但是图片依然是没有加载完（目前获取的offsetTop不包括其中的图片）
    //   // 一般情况下。offsetTop值不对都是因为图片的问题
    //   this.themeTopY = [];
    //   this.themeTopY.push(0);
    //   this.themeTopY.push(this.$refs.params.$el.offsetTop);
    //   this.themeTopY.push(this.$refs.comment.$el.offsetTop);
    //   this.themeTopY.push(this.$refs.recommend.$el.offsetTop);
    //   console.log(this.themeTopY);
    // })

  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh,50)
    this.detailImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.detailImgListener);
  },
  // updated() {
  //   // updated更新过于频繁
  //   this.themeTopY = [];
  //   this.themeTopY.push(0);
  //   this.themeTopY.push(this.$refs.params.$el.offsetTop);
  //   this.themeTopY.push(this.$refs.comment.$el.offsetTop);
  //   this.themeTopY.push(this.$refs.recommend.$el.offsetTop);
  //   console.log(this.themeTopY);
  // },
  destroyed() {
    this.$bus.$off('itemImageLoad', this.detailImgListener)
  },
  methods: {
    // ...mapActions(['addCart']),

    imageLoad() {
      this.$refs.scroll.refresh()

      // 下面的值只打印了一次不用做防抖动，如果打印多次，最好做防抖动
      // 防抖动目的是提高性能，当某个操作频繁执行的时候不用频繁
      // 每次图片加载完都获取最新的值
      this.themeTopY = [];
      this.themeTopY.push(0);
      // 差44是因为navbar是固定定位，offset是相对于定位父级
      this.themeTopY.push(this.$refs.params.$el.offsetTop - 44);
      this.themeTopY.push(this.$refs.comment.$el.offsetTop - 44);
      this.themeTopY.push(this.$refs.recommend.$el.offsetTop -44);
      // console.log(this.themeTopY);
      // 为了对条件进行优化，在增加一个最大值
      this.themeTopY.push(Number.MAX_VALUE)
    },
    titleClick(index) {
      // console.log(index);
      // 标题和内容的联动效果：
      // （1）在detail中监听标题的点击，获取index
      // （2）滚动到对应的标题内容： 需要获取到所有标题的offsetTop
      // 问题： 在哪里获取到的offsetTop才是正确的？
      // 1、cerate肯定不行，压根不能获取元素
      // 2、mounted也不行，数据还没有获取到
      // 3、updated里面也不行，Dom还没有渲染完
      // 4、$nextClick也不行，因为图片的高度没有计算在内
      // 5、图片加载完之后，获取到的高度才是正确的
      this.$refs.scroll.scrollTo(0, -this.themeTopY[index],200)
    },
    // 监听内容滚动事件
    contentScroll(position) {
      // console.log(position)
      // 1、获取y值
      const positionY = -position.y
      // 2、positionY和标题中的值进行对比
      // 遍历themeTopY数组，positionY在0和第二个值之间，index=0，标题显示商品，以此类推
      // for(let i in this.themeTopY) {
      //   //问题一： console.log(i) 注意： 这里获取到的i是字符串类型的， i+1得不到正确结果 str： 2 + 1=21
      //   // 解决方法：一：可以用 for(let i = 0, i < this.themeTopY.length; i++),不用es6语法；二：把字符串转为数值型
      //   // 问题二：themeTopY[i+1]会发生越界，滚动到推荐模块，值不对，滚动到最好一个模块，只需要大于即可
      //   // 综上：以下这种判断是不对的
      //   // if (positionY > this.themeTopY[parseInt(i)] && positionY < this.themeTopY[i+1]) {

      //   // }
      // }
      let length = this.themeTopY.length;
      for(let i = 0; i < length; i++) {
        // this.currentIndex !== i 是为了防止过于频繁
        if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopY[i] && positionY < this.themeTopY[i+1]) || (i === length - 1 && positionY > this.themeTopY[i]))) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          // 将Detail监听到的currentIndex传给DetailNavBar里面的currentIndex
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      // 条件优化：在themeTopY数组中加入一个最大值,但是不遍历这个值
      // for(let i = 0; i < length -1; i++) {
      // // if(this.currentIndex !== 1 && (positionY >= this.themeTopY[i] && positionY < this.themeTopY[i+1]))
      // }

      // 是否显示回到dingbu
      this.isShowBackTop = (-position.y) > 600
    },
     backClick() {
      // 通过ref属性拿到Scroll组件里面的scroll，然后调用scrollTo方法，传入第三个参数500，在500毫秒内完成回到顶部这个操作
      // this.$refs.scroll.scroll.scrollTo(0,0,500)
      // 在Scroll组件里面封装了scrollTo方法，调用里面的方法
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    addCart() {
      // console.log('点击添加购物车')
      // 1、获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goodsInfo.title
      product.desc = this.goodsInfo.desc
      product.price = this.goodsInfo.realPrice
      product.iid = this.iid
      // 2、将商品添加到购物车
      // this.$store.cartList.push(product) //尽量不要使用这种方法添加
      // addCart写在mutations中，通过commit,如果是写在actions中，通过dispatch
      this.$store.dispatch('addCart',product).then(res => {
        // console.log(res);
        // this.show = true;
        // this.message = res;

        // // 一段时间过后,添加成功的toast要隐藏
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = '';
        // },1500)
        // 重新封装Toast,至今通过$toast调用该方法
        this.$toast.show(res, 2000)
        // console.log(this.$toast)
      })
      // this.addCart(product).then(res => {
      //   console.log(res)
      // })
      // this.$store.commit('addCart',product)

      // 3、点击添加购物车，添加成功之后，显示弹框
    }
  }
}
</script>
<style scoped>
 #detail {
   /* 遮盖底部的首页，分类，购物车，我的 tab栏 */
   /* 详情页没有把其盖住，因为脱离了标准流，为了能盖住，提高层级，设置背景色 */
   position: relative;
   z-index: 9;
   background-color: #fff;
   /* 视口高度 */
   height: 100vh;
 }
 .content {
   background-color: #fff;
   /* 100%相对于父元素，而父元素没有固定的高度，所以父元素会根据内容撑开，我们希望父元素是固定高度，所以给父元素height: 100vh */
   /* 102= 44 + 58 */
   height: calc(100% - 102px);
 }
 .detail-nav {
   /* 相对位置是可以保持在原来的位置 ，不脱离标准流*/
   position: relative;
   z-index: 9;
   background-color: #fff;
 }
</style>