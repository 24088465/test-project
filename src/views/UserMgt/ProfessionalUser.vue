<template>
  <div class="container">
    <div class="sub-NormalUser-header">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-upload
        ref="upload"
        :limit="1"
        :file-list="fileList"
        accept=".xlsx,.xls"
        :auto-upload="false"
        :on-change="changeFile"
      >
      <!-- :http-request="requestFun" -->
        <template #trigger>
          <el-button type="primary" >导入</el-button>
        </template>
      </el-upload>
      <el-input
        style="width: 500px"
        v-model="search.name"
        placeholder="请输入专业用户名模糊搜索..."
      />
      <el-button type="primary" @click="getUserData">搜索</el-button>
    </div>

    <el-table :data="data.list" style="height: 100%">
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
    :model-value="action !== ''"
    :title="`${action === 'add' ? '新增' : '编辑'}用户`"
    width="40%"
    style="min-width: 300px"
    :show-close="false"
    @before-close="() => (action = '')"
  >
    <el-form label-position="top" label-width="100px" :model="formUser" ref="userForm">
      <el-form-item label="性别">
        <el-radio v-model="formUser.gender" label="女">女</el-radio>
        <el-radio v-model="formUser.gender" label="男">男</el-radio>
      </el-form-item>
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
          <el-button type="success" @click="onSubmit">确定</el-button>
          <el-button type="danger" @click="() => (action = '')">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup lang="tsx">
import { onMounted, ref, reactive, computed } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getUsers, deleteUser, updateUser, addUser } from '../../api/user/porfessional';
import { UserData, UserSearch, UserList } from './interface';
import type { UploadProps, UploadUserFile } from 'element-plus';
import axios from 'axios';

/**
 *  查询参数，page属性代表查询页码和一页的数量
 *  params 代表查询参数，name代表按照人名的模糊查询
 */
const search = reactive<UserSearch>({
  pageNum: 1,
  pageSize: 20,
  name: '',
});
// 列表渲染接口返回的数据
const data = reactive<UserList>({
  list: [],
  total: 0,
});
// 新增和修改表单的实例 ref
const userForm = ref();
/**
 * 重点：这里用到computed，代表这个数组返回值是变化的，你现在用不到，但是如果出现以下情况：
 * const visible = ref(false)
 * 某一项只有在 visible = true的时候再显示
 *     {
      prop: 'name',
      label: '用户名',
      hidden: !visible.value
    },

    可以在这个外层套一个控制它是否根据这个属性动态显示或者隐藏
    <template  v-for="column in tableColumns" v-if="!column?.hidden">
           <el-table-column
        v-bind="column"
        :key="column.prop"
        :min-width="column.minWidth || 125"
      />
      </template>
 */
const tableColumns = computed(() => {
  return [
    {
      prop: 'id',
      label: 'ID',
    },
    {
      prop: 'name',
      label: '真实姓名',
    },
    {
      prop: 'account',
      label: '账号',
    },
    {
      prop: 'password',
      label: '密码',
    },
    {
      prop: 'gender',
      label: '性别',
    },
    {
      prop: 'birth',
      label: '出生日期',
    },

    // {
    //   prop: 'state',
    //   label: '状态',
    //   formatter: (row: UserData) => {
    //     return <>{[row.state]}</>;
    //   },
    // },
    {
      label: '操作',
      formatter: (row: UserData) => {
        return (
          <>
            <el-button size="small" onClick={() => handleEdit(row)}>
              编辑
            </el-button>
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
// 表单逻辑同上
const formItems = computed(() => {
  return [
    {
      label: '用户名',
      prop: 'name',
      rules: [{ required: true, message: '用户名是必填项' }],
      render: () => <el-input placeholder="请输入用户名" />,
    },
    {
      label: '密码',
      prop: 'password',
      rules: [{ require: true, messgage: '密码是必填项', validator: password }],
      render: () => <el-input placeholder="请输入密码" />,
    },
    {
      label: '账号',
      prop: 'account',
      rules: [{ required: true, validator: handleAccount_num }],
      render: () => <el-input placeholder="请输入账号" />,
    },
    // {
    //   label: '手机号',
    //   prop: 'account',
    //   rules: [{ required: true, validator: handlePhone }],
    //   render: () => <el-input placeholder="请输入用户手机号" />,
    // },
    // {
    //   label: '备注',
    //   prop: 'remark',
    //   render: () => <el-input type="textarea" placeholder="请输入备注" />,
    // },
  ];
});

// 接口请求函数，这里的search就是查询参数，修改查询条件就是修改search的值
const getUserData = async (params?: {
  /// <reference types=".vue-global-types/vue_3.4_false.d.ts" />
  file:
  /// <reference types=".vue-global-types/vue_3.4_false.d.ts" />
  any;
}) => {
  let res: any = await getUsers(search);
  console.log(res);
  data.total = res.total;
  data.list = res.records;
};

// 同上
const changePage = (pageNum: number) => {
  search.pageNum = pageNum;
  getUserData();
};

// 这里需要一个初始值是因为编辑用户的时候是吧列表当前row 赋给表单formUser，但是新增的时候，表单值需要清空，就可以将这个初始值赋给它
const initVlaue = {
  name: '', // 添加用户的 用户名
  id: '',
  state: '',
  avatar: 'null',
  number: '',
  gender: '',
  state: 1,
};
// 添加用户的form数据
const formUser = reactive({ ...initVlaue });
// 添加用户
const onSubmit = () => {
  userForm.value?.validate(async (valid: boolean) => {
    if (valid) {
      const request = action.value == 'add' ? addUser : updateUser;
      await request(formUser);
      getUserData();
      action.value = '';
    }
  });
};

// 区分编辑和新增
const action = ref('');
const fileList = ref<UploadUserFile[]>([]);
const changeFile = (file: any) => {
  const formData = new FormData();
  formData.append("file",file.raw);
  console.log(file);
  requestFun("http://101.201.105.132:8090/api/professional-user/import",formData);
}
const requestFun = async (url: any,formData: any) => {

  try {
    // 发起文件上传请求
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    console.log(formData.get('file'),response,'文件'); 

   
    if (response.ok) {
      ElMessage.success('文件上传成功');
      getUserData();
    } else {
      ElMessage.error('文件上传失败');
    }
  } catch (error) {
    ElMessage.error('上传过程中出现错误');
    console.error(error);
  }
};
const handleEdit = (row: UserData) => {
  action.value = 'edit';
  Object.assign(formUser, row);
};

const handleAdd = () => {
  action.value = 'add';
  Object.assign(formUser, initVlaue);
  setTimeout(() => {
    userForm.value?.clearValidate();
  });
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
const handleAccount_num = (rule: any, value: any, callback: any) => {
  const regex = /^1[3-9]\d{9}$/; // 中国大陆手机号正则表达式
  if (!regex.test(value)) {
    callback(new Error('账号输入不符合规范，请重新输入！'));
  } else {
    callback();
  }
};

const password = (rule: any, value: any, callback: any) => {
  const regex = /^(?=.*\d).{1,16}$/;
  if (!regex.test(value)) {
    callback(new Error('密码至少包含数字，最多16位，请重新输入！'));
  } else {
    callback();
  }
};
</script>

<style lang="scss" scoped>
.table {
  position: relative;
  height: 620px;
  .pager {
    position: absolute;
    right: 0;
    bottom: -50px;
  }
}
.container {
  height: calc(100vh - 100px);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .sub-NormalUser-header {
    display: flex;
    align-items: center; /* 垂直居中 */
    column-gap: 12px;
    margin-bottom: 20px;
    :deep(.el-upload-list) {
      margin: 0;
    }
  }
}
.image-container {
  max-height: 130px; /* 设置最大高度 */
  overflow-y: auto; /* 超过高度时显示滚动条 */
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

.button-container {
  display: flex;
  align-items: center;
  /* 垂直居中 */
}

.button-container el-button {
  margin-right: 10px;
  /* 设置按钮之间的间距 */
}
.el-table {
  flex: 1;
  overflow: auto;
}
.el-pagination {
  margin-top: 25px;
  display: flex;
  flex-direction: row-reverse;
}
</style>
