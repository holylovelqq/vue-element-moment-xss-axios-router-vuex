<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div
    v-show="isLoading"
    class="loading__show"
    v-loading="isLoading"
    element-loading-background="rgba(242, 244, 246, 0.9)"
  ></div>
</template>
<script>
export default {
  name: 'LoadingShow',
  props: {
    isLoading: Boolean
  }
}
</script>
<style lang="scss" scoped>
.loading__show {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
