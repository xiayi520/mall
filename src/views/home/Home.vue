<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      ref="tabControl1"
        :titles="['流行', '新款', '精选']"
        class="tab-control"
        @tabClick="tabClick"
        v-show="isTabFixed"
      />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentScroll"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends" />
      <feature-view></feature-view>
      <tab-control
      ref="tabControl2"
        :titles="['流行', '新款', '精选']"
        class="tab-control"
        @tabClick="tabClick"
      />
      <!-- <good-list :goods="goods[currentType].list"/> -->
      <good-list :goods="showGoodsType" />
    </scroll>
    <!-- 组件是不能监听点击的，如果要监听，需要添加native修饰符 -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>
<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import {
  getHomeMultidata,
  getHomeGoods,
} from 'network/home'

import {debounce} from 'common/utils'
export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodList,
    Scroll,
    BackTop
  },
  data() {
    return {
      // 用变量存储数据
      banners: [],
      recommends: [],
      // 存储商品数据
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false, //默认情况不吸顶
      homeItemImgListener: null,
    }
  },
  computed: {
    showGoodsType() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    // 1.请求多个数据
   this.getHomeMultidata();
    // 2、请求商品数据
   this.getHomeGoods('pop');
   this.getHomeGoods('new');
   this.getHomeGoods('sell');
  },
  deactived() {
    // 取消全局事件监听
    this.$bus.$off('itemImageLoad',this.homeItemImgListener)
  },
  mounted() {
    // 1、图片加载完成的事件监听
    // 将refresh函数传入到debounce函数中生成一个新函数
    const refresh = debounce(this.$refs.scroll.refresh,50)

    // 保存监听的事件
    this.homeItemImgListener = () => {
        this.$refs.scroll && refresh();
    }
    // 注意： 如果是要拿$refs，不要在created里面拿
      //  监听goodsListItem中图片加载完成
      // 默认情况下$bus是空的，没有用，可以在main.js中，通过prototype
    // this.$bus.$on('itemImageLoad', () => {
    //   // 先判断是否有，有在执行下面操作
    //   // this.$refs.scroll && this.$refs.scroll.refresh()
    //   this.$refs.scroll && refresh();
    // })
    this.$bus.$on('itemImageLoad',this.homeItemImgListener)
    // 注： mounted里面获取到的offsetTop不包括图片在内的高度，此时图片还没有加载完成
    // 2、获取tabControl的offsetTop
    // 所有的组件都有一个属性$el，用于获取组件中的元素的
    // this.tabOffsetTop = this.$refs.tabControl.$el
  },
  methods: {
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop)
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    // 事件监听相关方法
    tabClick(index) {
      // console.log(index);
      switch (index) {
        case 0:
          this.currentType = 'pop';
          break;
        case 1:
          this.currentType = 'new';
          break;
        case 2:
          this.currentType = 'sell';
          break;
      }
      // 让两个tabControl保持一致
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      // 通过ref属性拿到Scroll组件里面的scroll，然后调用scrollTo方法，传入第三个参数500，在500毫秒内完成回到顶部这个操作
      // this.$refs.scroll.scroll.scrollTo(0,0,500)
      // 在Scroll组件里面封装了scrollTo方法，调用里面的方法
      this.$refs.scroll.scrollTo(0,0,500)
    },
    contentScroll(position) {
      // console.log(position);
      // 1、判断backTop是否显示
      this.isShowBackTop = (-position.y) > 600;
      // 2、决定tabControl是否吸顶（position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      // 监听不同类型的加载更多 currentType记录着当前我选中的类型
      this.getHomeGoods(this.currentType)
    },
    // 以下是网络请求数据相关方法
    getHomeMultidata() {
       getHomeMultidata().then(res => {
      // console.log(res);
      this.banners = res.data.banner.list;
      // console.log(this.banners);
      this.recommends = res.data.recommend.list;
      // console.log(this.recommends);
    })
    },
    getHomeGoods(type) {
      // page不能写死
      const page = this.goods[type].page + 1;
      getHomeGoods(type,page).then(res => {
      // console.log(res);
      // 把一个数组放入另外一个数组
      this.goods[type].list.push(...res.data.list);
      this.goods[type].page += 1;

      // 完成上拉加载更多
      this.$refs.scroll.finishPullUp()
    })
    }
  }
}
</script>
<style scoped>
#home {
  /* padding-top: 44px; */
  /* vh：视口高度 */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 在使用原生浏览器滚动时，为了让导航不跟随一起滚动，加的属性，现在改成better-scroll局部滚动，可以不用了 */
  /* 脱离标准流 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
  
}
.tab-control {
  position: relative;
  /* z-index只有对定位的元素才起效 */
  z-index: 9;
}
/* 原生css吸顶效果 */
/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */
/* .fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px
} */
.content {
  /* 滚动高度是总高度减去导航高度和tab栏高度 */
  /* height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>