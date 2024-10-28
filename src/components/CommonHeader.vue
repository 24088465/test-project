<!-- 顶部组件 -->
<template>
  <el-header>
    <!-- 左侧顶部组件 -->
    <div class="l-content">
      <!-- 图标展示 -->
      <el-button size="small" plain @click="handleCollapse">
        <el-icon :size="20">
          <Menu />
        </el-icon>
      </el-button>
      <h3></h3>
    </div>
    <!-- 右侧顶部组件(用户) -->
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <div class="userBox">
            <img class="user" :src="getImgSrc('user')" alt="" />
            <el-text class="name" size="large">欢迎,{{ userName }}</el-text>
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item>个人中心</el-dropdown-item> -->
            <el-dropdown-item @click="handleLoginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- <div class="l-content">
      <el-icon :size="size" :color="color">
        <Edit />
      </el-icon>
      <Edit style="width: 1em; height: 1em; margin-right: 8px" />
      <el-icon><CirclePlus /></el-icon>
    </div> -->
  </el-header>
</template>

<script>
// vuex
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import store from '@/store/index.js';
import { useRouter } from 'vue-router';
export default defineComponent({
  setup() {
    // 定义useStore并调用
    const store = useStore();
    const userName = ref(store.state.admin_account_num);
    onMounted(() => {
      const userName = store.state.admin_account_numF;
    });
    // vite引入静态图片
    let getImgSrc = (user) => {
      /*
      文档：https://cn.vitejs.dev/guide/assets.html#new-url-url-import-meta-url
      import.meta.url图片所在(组件)路径位置
            new URL("../assets/images/${user}.png", import.meta.url).href
      URL对象，里面有图片本地路径属性 */
      return new URL(`../assets/images/${user}.png`, import.meta.url).href;
    };
    // 左侧菜单栏收缩方法
    let handleCollapse = () => {
      // 调用vuex中的mutations
      store.commit('updateIsCollapse');
    };
    /* 退出登录 */
    /* 路由跳转页面方法
     */
    const router = useRouter();
    const handleLoginOut = () => {
      /* 在store中调用方发(菜品) */
      store.commit('cleanMenu');
      router.push({
        name: 'login',
      });
    };
    return {
      // imgSrc
      getImgSrc,
      handleCollapse,
      handleLoginOut,
      userName,
    };
  },
});
</script>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #0759b3;
}
/* 顶部右边 */
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .userBox {
    width: 160px;
    display: flex;
    justify-content: center;
    .name {
      color: white;
      margin-left: 20px;
      font-size: 20px;
      text-align: center;
    }
  }
}
/* 顶部中间 */
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
  h3 {
    color: #fff;
  }
}
</style>
