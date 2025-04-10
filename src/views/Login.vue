<template>
  <el-form :model="loginForm" class="login-container">
    <h3>公共空间后台管理系统</h3>
    <el-form-item>
      <el-input
        type="input"
        placeholder="请输入账号"
        v-model="loginForm.admin_account_num"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-input
        type="password"
        placeholder="请输入密码"
        v-model="loginForm.admin_password"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, getCurrentInstance, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getMenu } from '../api/permission';
import SupHome from '../views/home/SupHome.vue';
import SubHome from '../views/home/SubHome.vue';
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus';
import { componentMap } from '../componentMap';

export default {
  setup() {
    const loginForm = reactive({
      admin_account_num: '',
      admin_password: '',
    });

    const { proxy } = getCurrentInstance();
    const store = useStore();
    const router = useRouter();
    const login = async () => {
      try {
        const { admin_account_num, admin_password } = loginForm;
        const res = await getMenu(admin_account_num, admin_password);

        if (res.code === 200) {
          const { menu, token, type, admin_account_num } = res.data;

          store.commit('setToken', token);
          store.commit('setMenu', menu);
          store.commit('setType', type);
          store.commit('setName', admin_account_num);
          menu.forEach((item) => {
            // 检查每个菜单项是否有子路由
            if (item.children) {
              // 如果有子路由，遍历每个子路由
              item.children.forEach((child) => {
                // 向路由器添加子路由
                router.addRoute('home1', {
                  path: child.path, // 子路由的路径
                  name: child.name, // 子路由的名称
                  component: componentMap[child.url], // 使用映射表,动态导入子路由组件
                });
              });
            } else {
              // 如果没有子路由，直接添加当前菜单项作为路由
              router.addRoute('home1', {
                path: item.path, // 路由的路径
                name: item.name, // 路由的名称
                component: componentMap[item.url], // 使用映射表,动态导入组件
              });
            }
          });

          // 根据用户类型跳转
          if (type === 0) {
            router.push({ name: 'supHome' });
          } else if (type === 1) {
            router.push({ name: 'subHome' });
          }
        } else {
          ElNotification({
            type: 'error',
            message: '账号或密码错误',
          });
        }
      } catch (error) {
        console.error('登录请求出错：', error);
      }
    };

    return {
      loginForm,
      login,
    };
  },
};
</script>

<!-- component: () => import(`../views/${item.url}.vue`), -->
<style scoped>
.login-container {
  width: 350px;
  background-color: #a6b3b3;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 20px 35px 10px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 30vh auto;
}
.login-container h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #5054;
}
:deep(.el-form-item__content) {
  justify-content: center;
}
</style>
