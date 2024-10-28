import { createStore } from 'vuex';
import router from '../router';
import Cookie from 'js-cookie';
import axios from 'axios';

export default createStore({
  state: {
    isCollapse: true,
    menu: [],
    token: '',
    type: '', // 添加 type 状态
    /* localStorage 中获取键为 admin_account_num 的值。如果之前使用 localStorage.setItem('admin_account_num', val) 存储过值，那么此时将会获取到存储的值。 */
    admin_account_num: localStorage.getItem('admin_account_num') || '',
  },
  mutations: {
    updateIsCollapse(state) {
      state.isCollapse = !state.isCollapse;
    },
    setMenu(state, val) {
      state.menu = val;
      localStorage.setItem('menu', JSON.stringify(val));
    },
    addMenu(state, router) {
      const storedMenu = localStorage.getItem('menu');
      if (!storedMenu) {
        return;
      }

      try {
        const menu = JSON.parse(storedMenu);
        state.menu = menu;

        const modules = import.meta.glob('../views/*/*.vue');
        const menuArray = [];

        menu.forEach((item) => {
          if (item.children) {
            item.children = item.children.map((child) => {
              let url = `../views/${child.url}.vue`;
              child.component = modules[url];
              return child;
            });
            menuArray.push(...item.children);
          } else {
            let url = `../views/${item.url}.vue`;
            item.component = modules[url];
            menuArray.push(item);
          }
        });

        menuArray.forEach((item) => {
          router.addRoute('home1', item);
        });
      } catch (error) {
        console.error('JSON 解析错误: ', error);
      }
    },
    cleanMenu(state) {
      state.menu = [];
      localStorage.removeItem('menu');
    },
    setToken(state, val) {
      state.token = val;
      Cookie.set('token', val);
    },
    clearToken(state) {
      state.token = '';
      Cookie.remove('token');
    },
    getToken(state) {
      state.token = state.token || Cookie.get('token');
    },
    setType(state, val) {
      state.type = val;
    },
    setName(state, val) {
      state.admin_account_num = val;
      /* 将 admin_account_num 状态值存储到浏览器的 localStorage 中，以键值对的形式保存。即使用户刷新页面或关闭浏览器后再打开，这些数据依然会被保留。 */
      localStorage.setItem('admin_account_num', val);
    },
  },
  // actions: {
  //   async login({ commit }, { admin_account_num, admin_password }) {
  //     try {
  //       const response = await axios.post('http://101.201.105.132:8090/admin/login', {
  //         admin_account_num,
  //         admin_password,
  //       });
  //       const data = response.data;
  //       if (data.code === 200) {
  //         commit('setToken', data.token);
  //         commit('setMenu', data.menu);
  //         commit('setType', data.type); // 设置用户类型
  //         commit('setName', data.name);
  //         console.log(setName)
  //         // 根据用户类型进行判断并跳转
  //         if (data.type === 1) {
  //           router.push('/home/SubHome');
  //         } else if (data.type === 0) {
  //           router.push('/home/SupHome');
  //         }
  //       } else {
  //         throw new Error(data.message || '登录失败');
  //       }
  //     } catch (error) {
  //       console.error('登录请求出错：', error);
  //       throw error;
  //     }
  //   },
  // },
  getters: {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.user,
  },
});
