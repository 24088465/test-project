<template>
  <div class="sub-admin-header" style="margin-bottom: 20px">
    <el-upload
      ref="upload"
      class="upload-demo"
      :limit="1"
      :file-list="fileList"
      action="#"
      accept=".xlsx,.xls"
      :http-request="requestFun"
    ></el-upload>
    <el-input
      style="width: 500px"
      v-model="search.openid"
      placeholder="请输入普通用户名模糊搜索..."
    />
    <el-button style="margin-left: 13px" type="primary" @click="getUserData">
      搜索
    </el-button>
  </div>
  <div class="table">
    <el-table :data="data.list" style="width: 100%; height: 100%">
      <el-table-column label="头像" prop="avatar" width="180">
        <template #default="scope">
          <div v-if="scope.row.avatar">
            <!-- <a :href="`${scope.row.avatar}`" target="_blank">
            <el-image :src="scope.row.avatar" style="width: 100px; height: 100px" />
          </a > -->
            <el-image :src="scope.row.avatar" style="width: 100px; height: 100px" />
          </div>
          <div v-else>暂无头像</div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="column in tableColumns"
        v-bind="column"
        :key="column.prop"
        :min-width="column.minWidth || 125"
      />
    </el-table>
    <el-pagination
      small
      background
      layout="prev, pager, next"
      :total="data.total"
      @current-change="changePage"
      class="pager mt-4"
    />
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="40%"
    style="min-width: 300px"
    :before-close="handleClose"
    :show-close="false"
  >
    <el-form label-position="top" label-width="100px" :model="formUser" ref="userForm">
      <el-form-item
        style="width: 100%"
        v-for="item in formItems"
        :key="item.prop"
        v-bind="item"
      >
        <component :is="item.render()" v-model="formUser[item.prop]" />
      </el-form-item>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="success" @click="handleCancel">确定</el-button>
          <el-button type="danger" @click="handleCancel1">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup lang="tsx">
import { onMounted, ref, reactive, computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from '../../api/user/normal-user-data';
import { UserData, UserSearch, UserList } from './interface';
import test from 'node:test';

const dialogTitle = ref('');
const search = reactive<UserSearch>({
  pageNum: 1,
  pageSize: 10,
  openid: '',
});
const data = reactive<UserList>({
  list: [],
  total: 0,
});

const userForm = ref();
const tableColumns = computed(() => {
  return [
    // {
    //   prop: 'name',
    //   label: '用户名',
    // },

    // {
    //   prop: 'avatar',
    //   label: '头像',
    // },
    {
      prop: 'id',
      label: 'ID',
    },
    {
      prop: 'openid',
      label: '账号',
    },
    {
      prop: 'name',
      label: '用户名',
    },

    {
      prop: 'passwprd',
      label: '密码',
    },
    {
      prop: 'birth',
      label: '出生日期',
    },
    // {
    //   prop: 'remark',
    //   label: '备注',
    //   minWidth: 200,
    // },
    // {
    //   prop: 'addr',
    //   label: '邮箱',
    //   minWidth: 220,
    // },

    {
      label: '操作',
      formatter: (row: UserData) => {
        return (
          <>
            <el-button type="danger" size="small" onClick={() => handleDelete(row)}>
              删除
            </el-button>
          </>
        );
      },
      minWidth: 180,
    },
  ];
});

const getUserData = async () => {
  let res: any = await getUsers(search);
  console.log(res);
  data.total = res.total;
  data.list = res.records;
};

const changePage = (pageNum: number) => {
  search.pageNum = pageNum;
  getUserData();
};

// 控制模态框的显示隐藏
const dialogVisible = ref(false);
const handleClose = (done: any) => {
  ElMessageBox.confirm('确定关闭吗?')
    .then(() => {
      userForm.value?.resetFields();
      done();
    })
    .catch(() => {
      // catch error
    });
};

// 添加用户的form数据
const formUser = reactive({
  id: 'null', // 添加用户的 用户名
  avatar: 'null',
  openid: '',
  password: '',
  name: '',
  gender: '',
  birth: 'null',
});
const handleCancel = () => {
  dialogVisible.value = true;
};
// 取消
const handleCancel1 = () => {
  dialogVisible.value = false;
};
// 区分编辑和新增
const action = ref('add');

const fileList = ref([]);
const requestFun = (files: any) => {
  console.log(files, '把文件给他');
  // 调用接口的 上传文件的
};

const handleEdit = (row: UserData) => {
  action.value = 'edit';
  dialogTitle.value = '编辑用户';
  dialogVisible.value = true;
  Object.assign(formUser, row);
};

const handleAdd = () => {
  action.value = 'add';
  dialogTitle.value = '新增用户';
  dialogVisible.value = true;
  userForm.value?.resetFields();
};

// 删除用户
const handleDelete = (row: UserData) => {
  ElMessageBox.confirm('你确定删除吗?').then(async () => {
    await deleteUser(row.id);
    ElMessage({
      showClose: true,
      message: '删除成功',
      type: 'success',
    });
    getUserData();
  });
};

onMounted(() => {
  getUserData();
});

//邮箱校验
const handleEmail = (rule: any, value: any, callback: any) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(value)) {
    callback(new Error('邮箱输入不符合规范，请重新输入！'));
  } else {
    callback();
  }
};
//密码校验

//手机号校验
const handlePhone = (rule: any, value: any, callback: any) => {
  const regex = /^1[3-9]\d{9}$/; // 中国大陆手机号正则表达式
  if (!regex.test(value)) {
    callback(new Error('手机号输入不符合规范，请重新输入！'));
  } else {
    callback();
  }
};
</script>

<style lang="less" scoped>
.table {
  position: relative;
  height: 620px;
  .pager {
    position: absolute;
    right: 0;
    bottom: -50px;
  }
}
.sub-admin-header {
  display: flex;
  align-items: center;
  /* 垂直居中 */
}

.spacer {
  flex-grow: 1;
  /* 占据剩余空间 */
  margin-left: 10px;
  /* 适当的间距 */
  margin-right: 10px;
  /* 适当的间距 */
}

:deep(.el-upload-list) {
  display: none;
}
</style>
