<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/images/user.png" alt="" />
          <div class="userinfo">
            <p class="name">{{ userName }}</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>
            本次登录时间
            <span>{{ timeFormat(loginTime) }}</span>
          </p>
          <!-- <p>
            上次登录地点
            <span>北京顺义</span>
          </p> -->
        </div>
      </el-card>
    </el-col>

    <el-col :span="16" style="margin-top: 20px"></el-col>
  </el-row>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import store from '@/store/index.js';
export default defineComponent({
  setup() {
    const store = useStore();
    const userName = ref(store.state.admin_account_num);
    const loginTime = ref(new Date().toString());
    console.log(userName);
    const timeFormat = (time) => {
      if (!time) return '';
      const timeObj = new Date(time);
      const year = timeObj.getFullYear();
      const month = timeObj.getMonth() + 1;
      const date = timeObj.getDate();
      const hour = add(timeObj.getHours());
      const minute = add(timeObj.getMinutes());
      function add(m) {
        return m < 10 ? '0' + m : m;
      }
      return `${year}-${month}-${date} ${hour}:${minute}`;
    };

    onMounted(() => {
      const userName = store.state.admin_account_numF;
      loginTime.value = new Date().toString();
    });

    return { userName, loginTime, timeFormat };
  },
});
</script>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  img {
    width: 50px;
    border-radius: 50%;
    margin-right: 40px;
  }
  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span {
        color: #666;
      }
    }
  }
}
</style>
