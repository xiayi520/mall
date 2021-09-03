<template>
  <div class="check-button" :class="{check:isChecked}">
    <img src="~assets/img/cart/tick.svg" alt="">
  </div>
</template>
<script>
export default {
  name: "CheckButton",
  props: {
    isChecked: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
  .check-button {
    
    border-radius: 50%;
    /* 不选中状态下，边框颜色 */
    border: 2px solid #aaa;
  }
  /* 选中状态下，边框颜色为红色 */
  .check {
    background-color: red;
    border-color: red;
  }
</style>