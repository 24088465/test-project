<template>
  <!-- 左侧下拉菜单 -->
  <el-aside width="$store.state.isCollapse ? '180px' : '64px' ">
    <!-- :collapse="false"折叠 -->
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#0759b3"
      text-color="#fff"
      :collapse="!$store.state.isCollapse"
    >
      <!-- 左侧菜单缩放 -->
      <h3 v-show="$store.state.isCollapse">后台管理</h3>
      <h3 v-show="!$store.state.isCollapse">管理</h3>
      <!-- 左侧一级菜单 -->
      <el-menu-item
        :index="item.path"
        v-for="item in noChildren()"
        :key="item.path"
        @click="clickMenu(item)"
      >
        <!-- vue3引用icon -->
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <!-- 左侧二级下拉菜单 -->
      <el-sub-menu :index="item.label" v-for="item in hasChildren()" :key="item.path">
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            :index="subItem.path"
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
            @click="clickMenu(subItem)"
          >
            <component class="icons" :is="subItem.icon"></component>
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  // setup生命周期集合
  setup() {
    // vuex
    const store = useStore();
    // 路由
    const router = useRouter();

    // 判断是否有二级菜单
    const noChildren = () => {
      /* 确保 asyncList 不为 null，以及每个项不为 null，
      然后再对数组进行筛选。
      这样可以避免 TypeError，并确保你的代码能够正常运行。 */
      if (!Array.isArray(asyncList)) {
        console.error('asyncList没有数组');
        return [];
      }
      // filter 对数据进行筛选
      return asyncList.filter((item) => item && !item.children);
    };

    const hasChildren = () => {
      /* 确保 asyncList 不为 null，以及每个项不为 null，
      然后再对数组进行筛选。
      这样可以避免 TypeError，并确保你的代码能够正常运行。 */
      if (!Array.isArray(asyncList)) {
        console.error('asyncList is not an array');
        return [];
      }

      // filter 对数据进行筛选
      return asyncList.filter((item) => item && item.children);
    };

    const asyncList = store.state.menu;
    /* 路由跳转页面方法
    定义useRouter调用router */
    const clickMenu = (item) => {
      router.push({
        name: item.name,
      });
    };
    return {
      noChildren,
      hasChildren,
      clickMenu,
    };
  },
};
</script>

<style lang="less" scoped>
.icons {
  width: 18px;
  height: 18px;
}
.el-menu {
  height: 100%;
  border-right: none;
  text-align: center;
  li :hover {
    color: bisque;
  }
  h3 {
    line-height: 48px;
    color: #fff;
    text-align: center;
  }
}
.el-aside {
  height: 100vh;
}
</style>
