<template>
  <div class="bottom-bar">
    <div class="check-content">
      <!-- :isChecked="isSelectAll" 用于监听商品选中，全选按钮是否跟着选中，当商品全部选中，全选按钮选中，当有一件商品没有选中，
      全选按钮不选中-->
      <!-- @click="checkClick"用于监听全选按钮的点击。当点击全选按钮，全部商品被选中 -->
      <check-button  class="check-button" :isChecked="isSelectAll" @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>
<script>
import CheckButton from 'components/content/checkButton/CheckButton'
export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    totalPrice() {
      return  '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((pre, item) => {
        return pre + item.price * item.count
      },0).toFixed(2)
    },
    checkLength() {
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    // 判断全选按钮是否选中
    isSelectAll() {
      // 当购物车为空，全选按钮默认不选中
      if(this.$store.state.cartList.length === 0) return false
      // 数组高级函数用法：
      // 只要有一个没有选中。全选按钮就不选中
      // !item.checked  找不选中状态，并且有长度，全选就不选中，所以在整体前面在取反一次
      // 注： 数字（length)也是可以取反的 ，0是false。除0之外的数字都是true
      return !(this.$store.state.cartList.filter(item => !item.checked).length)
      // return !this.$store.state.cartList.find(item => !item.checked)
      // return this.$store.state.cartList.find(item => item.checked === false) === undefined

      // 普通遍历方法：
      // for (let item of this.$store.state.cartList) { 遍历cartList
      //   if(!item.checked) {  // 如果item.checked为false，
      //     return false; // 那么全选就返回false,全选不选中
      //   }
      // }
      // return true  //如果遍历完cartList,都找不到item.checked为false，那么就返回true，全选按钮选中
    }
  },
  methods: {
    // 监听全选按钮的点击
    // 如果原来都是被选中的，点击一次，全部不选中
    // 如果原来都是没有选中（或者某些没有选中），点击一次，全部被选中
    checkClick() {
      if(this.isSelectAll) { //全部选中
        this.$store.state.cartList.forEach(item => item.checked = false)
      } else {
        this.$store.state.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick() {
      if(!this.checkLength) {
        this.$toast.show('请选择购买的商品',2000)
      }
    }
  }
}
</script>
<style scoped>
  .bottom-bar {
    display: flex;
    height: 40px;
    line-height: 40px;
    background-color: #eee;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 44px;
    /* bottom: 40px; */
  }
  .check-content {
    display: flex;
    width: 60px;
    align-items: center;
    margin-left: 10px;
  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price {
    margin-left: 30px;
    flex: 1;
  }
  .calculate {
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>