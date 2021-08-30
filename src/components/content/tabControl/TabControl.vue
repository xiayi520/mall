<template>
  <div class="tab-control">
    <!-- 只有文字不同的情况下，其余样式都相同，可以不用插槽，只需要让传入不同的文字就可以 -->
    <div
      v-for="(item, index) in titles"
      :key="item.title"
      class="tab-control-item"
      :class="{ active: index == currentIndex }"
      @click="itemClick(index)"
    >
      <span>{{ item }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      this.$emit('tabClick',index);
    }
  },
};
</script>
<style  scoped>
.tab-control {
  display: flex;
  text-align: center;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
  background-color: #fff;
}
.tab-control-item {
  flex: 1;
}
.tab-control-item span {
  padding: 5px;
}
.active {
  color: var(--color-hight-text);
}
.active span {
  border-bottom: 3px solid var(--color-tint);
}
</style>