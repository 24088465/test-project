<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 左侧菜单栏 -->
      <common-aside />
      <el-container class="r-container">
        <!-- 顶部 -->
        <common-header />
        <!-- 右侧内容区 -->
        <el-main><router-view /></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import CommonHeader from '../components/CommonHeader.vue';
import CommonAside from '../components/CommonAside.vue';
export default defineComponent({
  components: {
    CommonHeader,
    CommonAside,
  },
});
</script>
<style lang="less" scoped>
.el-container {
  flex-wrap: wrap;
  align-items: flex-start;
  height: 100%;

}
.common-layout {
  .lay-container {
    flex-wrap: nowrap;
    .right-main {
      height: calc(100% - 124px) !important;
    }
  }
  height: 100%;
  & > .el-container {
    height: 100%;
    & > .el-aside {
      background: #545c64;
    }
  }
}
</style>
