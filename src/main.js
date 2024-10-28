import { createApp } from 'vue';
// import "./style.css";
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引入less样式设置
import './assets/less/index.less';
// 引入vuex
import store from './store/index.js';
import router from './router';
// 引入mock
import './api/mock.js';
// 引入api
const app = createApp(App);
// Icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 引入permission用户权限控制.js
import { getMenu } from './api/permission';

/* 将api通过app.config.globalProperties方法配置全局属性 
$api为全局配置对象中的属性名
*/
/* app.config.globalProperties.$api = api; */
/* 在页面加载是匹配动态路由 */
store.commit('addMenu', router);
app.use(ElementPlus);
/* 检查路由 */
function checkRouter(path) {
  let hasCheck = router
    .getRoutes()

    .filter((route) => route.path == path).length;
  if (hasCheck) {
    return true;
  } else {
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  try {
    // 获取用户 token
    store.commit('getToken');
    const token = store.state.token;

    // 如果用户未登录且试图访问需要登录权限的页面，则跳转到登录页
    if (!token && to.name !== 'login') {
      next({ name: 'login' });
      return;
    }

    // 如果目标路由不存在，则跳转到默认页面
    if (!checkRouter(to.path)) {
      next({ name: 'NotFound' }); // 修复这里的逻辑，确保有默认跳转
      return;
    }

    // 获取用户类型
    const userType = store.state.userType;

    // 根据用户类型进行导航控制
    if (userType === 1 && to.name !== 'SubHome') {
      next({ name: 'subHome' });
      return;
    } else if (userType === 0 && to.name !== 'SupHome') {
      next({ name: 'supHome' });
      return;
    }
    // console.log('路由守卫：目标路由', to.path);
    // console.log('路由守卫：用户 token', token);
    // console.log('路由守卫：用户类型', userType);
    next(); // 确保在所有检查后都调用 next()
  } catch (error) {
    console.error('路由守卫错误：', error);
    next({ name: 'login' });
  }
});

app.use(router);
app.use(store);
app.mount('#app');
