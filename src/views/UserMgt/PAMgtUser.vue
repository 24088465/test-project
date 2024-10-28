<template>
  <div class="sub-admin-header">
    <el-button style="margin-right: 20px" type="primary" @click="handleAdd">
      添加
    </el-button>
    <el-upload
      ref="upload"
      class="upload-demo"
      :limit="1"
      :file-list="fileList"
      action="#"
      accept=".xlsx,.xls"
      :http-request="requestFun"
    >
      <!-- <template #trigger>
        <el-button type="primary">导入</el-button>
      </template> -->
    </el-upload>
    <el-input
      style="width: 500px"
      v-model="search.name"
      placeholder="请输入子管理员模糊搜索..."
    />
    <el-button type="primary" @click="getUserData">搜索</el-button>
  </div>
  <div class="table">
    <el-table :data="data.list" style="width: 100%; height: 100%">
      <!-- <el-table-column label="头像" prop="avatar" width="180">
        <template #default="scope">
          <a :href="`${scope.row.avatar}`" target="_blank">
            <el-image :src="scope.row.avatar" style="width: 100px; height: 100px" />
          </a>
        </template>
      </el-table-column> -->
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
          <el-button type="success" @click="onSubmit">确定</el-button>
          <el-button type="danger" @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
  <el-dialog v-model="showSwiper" title="轮播信息" width="520px">
    <el-table :data="isSwiperData">
      <el-table-column prop="id" label="id" width="40" />
      <el-table-column label="提案图片" prop="content_picture" width="150">
        <template #default="scope">
          <div v-if="scope.row.content_picture">
            <el-scrollbar class="image-container" min-size:10px hide-scrollbar>
              <div
                v-for="(url, index) in parseImageUrls(scope.row.content_picture)"
                :key="index"
              >
                <a :href="url" target="_blank">
                  <el-image :src="url" style="width: 100px; height: 100px" />
                </a>
              </div>
            </el-scrollbar>
          </div>
          <div v-else>暂无图片</div>
        </template>
      </el-table-column>
      <el-table-column prop="isSwiper" label="状态" width="110" />
      <el-table-column fixed="right" label="轮播管理" width="180">
        <template #default="{ row }">
          <div class="button-container">
            <el-button type="primary" size="small" plain @click="changeSwiper(row, 1)">
              轮播
            </el-button>
            <el-button type="danger" size="small" plain @click="changeSwiper(row, 0)">
              不轮播
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeswiper">关闭</el-button>
    </span>
  </el-dialog>
  <el-dialog v-model="showDialog" title="审核信息" width="85.5%">
    <p>活动：{{ activityName }}</p>

    <el-table :data="activityData" style="height: auto; width: 100%">
      <el-table-column prop="id" label="id" width="40" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="startTime" label="开始时间" width="100" />
      <el-table-column prop="deadline" label="结束时间" width="100" />
      <el-table-column prop="content_text" label="内容" width="200" />
      <el-table-column label="活动文件" prop="content_document" width="150">
        <template #default="scope">
          <div v-if="scope.row.content_document">
            <el-scrollbar class="image-container" min-size:10px hide-scrollbar>
              <div
                v-for="(url, index) in parseDocumentUrls(scope.row.content_document)"
                :key="index"
              >
                <a :href="url" target="_blank">
                  {{ getFileName(url) }}
                </a>
              </div>
            </el-scrollbar>
          </div>
          <div v-else>暂无文件</div>
        </template>
      </el-table-column>
      <el-table-column label="活动图片" prop="content_picture" width="180">
        <template #default="scope">
          <div v-if="scope.row.content_picture">
            <el-scrollbar class="image-container" min-size:10px hide-scrollbar>
              <div
                v-for="(url, index) in parseImageUrls(scope.row.content_picture)"
                :key="index"
              >
                <a :href="url" target="_blank">
                  <el-image :src="url" style="width: 100px; height: 100px" />
                </a>
              </div>
            </el-scrollbar>
          </div>
          <div v-else>暂无图片</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="审核状态"
        :formatter="formatState"
        width="100"
      />
      <!-- <el-table-column prop="state" label="状态" :formatter="formatState">
   

      </el-table-column> -->
      <el-table-column fixed="right" label="审核" width="180">
        <template #default="{ row }">
          <div class="button-container">
            <el-button type="primary" size="small" @click="() => approve(row, 1)">
              通过
            </el-button>
            <el-button type="danger" size="small" @click="approve(row, 0)">
              不通过
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <p>提案：{{ proposalContent }}</p>

    <el-table :data="proposalData" style="height: auto; width: 100%">
      <el-table-column prop="id" label="id" width="40" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="startTime" label="开始时间" width="100" />
      <el-table-column prop="deadline" label="结束时间" width="100" />
      <el-table-column prop="content_text" label="内容" width="200" />
      <el-table-column label="提案文件" prop="content_document" width="150">
        <template #default="scope">
          <div v-if="scope.row.content_document">
            <el-scrollbar class="image-container" min-size:10px hide-scrollbar>
              <div
                v-for="(url, index) in parseDocumentUrls(scope.row.content_document)"
                :key="index"
              >
                <a :href="url" target="_blank">
                  {{ getFileName(url) }}
                </a>
              </div>
            </el-scrollbar>
          </div>
          <div v-else>暂无文件</div>
        </template>
      </el-table-column>
      <el-table-column label="提案图片" prop="content_picture" width="180">
        <template #default="scope">
          <div v-if="scope.row.content_picture">
            <el-scrollbar class="image-container" min-size:10px hide-scrollbar>
              <div
                v-for="(url, index) in parseImageUrls(scope.row.content_picture)"
                :key="index"
              >
                <a :href="url" target="_blank">
                  <el-image :src="url" style="width: 100px; height: 100px" />
                </a>
              </div>
            </el-scrollbar>
          </div>
          <div v-else>暂无图片</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="审核状态"
        :formatter="formatState"
        width="100"
      />
      <!-- <el-table-column prop="state" label="状态" :formatter="formatState" /> -->
      <el-table-column fixed="right" label="审核" width="180">
        <template #default="{ row }">
          <div class="button-container">
            <el-button type="primary" size="small" @click="reject(row, 1)">
              通过
            </el-button>
            <el-button type="danger" size="small" @click="reject(row, 0)">
              不通过
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script setup lang="tsx">
import { onMounted, ref, reactive, computed } from 'vue';
import { ElMessageBox, ElMessage, anchorEmits } from 'element-plus';
import { getUsers, deleteUser, updateUser, addUser } from '@/api/user/pamgt-user-data';
import { UserData, UserSearch, UserList, SubProcess } from './interface';
import { getActivityDatas, updateActivity } from '@/api/process';
import { getProposalDatas, updateProposal } from '@/api/process2';
import { getIsSwiper, updateIsSwiper } from '@/api/swiper';
import store from '@/store/index.js';
let id = store.state.token;
let activityData: any[] = [];
let proposalData: any[] = [];
let isSwiperData: any[] = [];
let showDialog = ref(false);
let showSwiper = ref(false);
const activityName = ref('');
const proposalContent = ref('');

const getFileName = (url) => {
  const fileName = url.split('/').pop();
  // 使用正则表达式去掉 UUID
  return fileName.replace(/^[a-f0-9]{32}_/, '');
};
// 显示多张图片
const parseImageUrls = (content_picture) => {
  if (!content_picture) return [];
  // 去掉开头的逗号
  content_picture = content_picture.replace(/^,/, '');
  return content_picture.split(',');
};
const parseDocumentUrls = (content_document) => {
  if (!content_document) return [];
  // 去掉开头的逗号
  content_document = content_document.replace(/^,/, '');
  return content_document.split(',');
};
const showApprovalDialog = async (row: SubProcess) => {
  console.log(id, row, 'row');

  try {
    const params = {
      id: row.adminid,
      name: null,
      pageNum: 1,
      pageSize: 10,
    };

    const activityRes: any = await getActivityDatas(params);

    //console.log(activityRes)
    // getActivityData(params).then(res => {
    //   console.log(res)
    // }).catch(err => {row
    //   console.log(err);
    // }).finally(() => {
    //   // loading = false;
    // });

    // catch code !== 200 then().catch()
    console.log(activityRes, 'activityRes');

    // map foreach filter find  every some reduce
    // Object.assign keys values
    activityData = activityRes.records.filter(
      (item: { adminid: any; id: number }) => item.adminid == row.id
    );
    activityData = activityData.map((item: any) => {
      item.state = item.state == 0 ? '审核未通过' : '审核通过';
      return item;
    });

    // activityData = activityRes.records;

    const proposalRes: any = await getProposalDatas(params);
    proposalData = proposalRes.records.filter(
      (item: { adminid: any; id: number }) => item.adminid == row.id
    );
    proposalData = proposalData.map((item: any) => {
      item.state = item.state == 0 ? '审核未通过' : '审核通过';
      return item;
    });

    showDialog.value = true;
  } catch (error) {
    console.error('获取活动或提案数据时出错：', error);
    // 处理错误情况
  }
};

//活动
const approve = async (row: any, state: number) => {
  ElMessageBox.confirm('请确认您的选择', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const params = {
        id: row.id,
        state: state,
      };
      console.log('row.id---', row.id);
      const res: any = await updateActivity(params);

      if (res.code == 200) {
        ElMessage.success('审核成功');

        // 更新活动数据
        const activityParams = {
          id: row.id,
          name: null,
          pageNum: 1,
          pageSize: 10,
        };
        const activityRes: any = await getActivityDatas(activityParams);
        activityData = activityRes.records;
      } else {
        ElMessage.error('审核失败');
      }
    })
    .catch(() => {
      ElMessage.error('审核失败');
    });
};

//提案
const reject = async (row: any, state: number) => {
  ElMessageBox.confirm('请确认您的选择', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const params = {
      id: row.id,
      state: state,
    };

    let res: any = await updateProposal(params);
    if (res.code == 200) {
      ElMessage.info('审核成功');
      const params = {
        id: row.id,
        name: null,
        pageNum: 1,
        pageSize: 10,
      };
      const proposalRes: any = await getProposalDatas(params);
      data.list = res.records.map((item: { type: string | number }) => {
        item.type = item.type === 0 ? '未通过' : '通过';
        return item;
      });

      console.log(proposalRes, 'proposalRes');
      proposalData = proposalRes.records;
    } else {
      ElMessage.error('审核失败');
    }
  });
};
// 关闭弹窗
const closeDialog = () => {
  showDialog.value = false;
};
const dialogTitle = ref('');
const search = reactive<UserSearch>({
  pageNum: 1,
  pageSize: 10,
  name: '',
});
const data = reactive<UserList>({
  list: [],
  total: 0,
});
const userForm = ref();
const tableColumns = computed(() => {
  return [
    // TODO: 修改数据行prop属性名与返回结果属性名对应
    {
      prop: 'id',
      label: '管理员id',
    },
    {
      prop: 'admin_account_num',
      label: '管理员账号',
      width: 200,
    },
    {
      prop: 'admin_password',
      label: '管理员密码',
      width: 200,
    },
    {
      prop: 'type',
      label: '类型',
    },
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
      minWidth: 150,
    },
    {
      label: '轮播管理',
      formatter: (row: UserData) => {
        return (
          <>
            <el-button type="success" size="small" onClick={() => showSwiperlDialog(row)}>
              轮播管理
            </el-button>
          </>
        );
      },
    },
    {
      label: '审核',
      formatter: (row: SubProcess) => {
        return (
          <>
            <el-button
              type="success"
              size="small"
              onClick={() => showApprovalDialog(row)}>
              审核
            </el-button>
          </>
        );
      },
    },
  ];
});

const formItems = computed(() => {
  return [
    // TODO: 与数据行属性名对应
    {
      label: '管理员账号',
      prop: 'admin_account_num',
      rules: [{ required: true, message: '账号是必填项' }],
      render: () => <el-input placeholder="请输入账号" />,
    },
    // {
    //   label: '用户id',
    //   prop: 'id',
    //   rules: [{ required: true, message: 'id是必填项' }],
    //   render: () => <el-input placeholder="请输入用户id" />,
    // },
    {
      label: '密码',
      prop: 'admin_password',
      rules: [{ required: true, message: '密码是必填项' }],
      render: () => <el-input placeholder="请输入密码" />,
    },
  ];
});

const getUserData = async () => {
  const res: any = await getUsers(search);
  console.log(res);
  data.total = res.total;
  data.list = res.records.map((item: { type: string | number }) => {
    item.type = item.type === 0 ? '超管' : '子管理员';
    return item;
  });
};
const changePage = (pageNum: number) => {
  search.pageNum = pageNum;
  getUserData();
};
// 轮播
const showSwiperlDialog = async (row: UserData) => {
  const params = {
    // row.id 表示当前表格行对应用户的唯一标识符，用于获取该特定用户的轮播图数据
    pageNum: 1,
    pageSize: 10,
    adminid: row.id,
  };
  const SwiperRes: any = await getIsSwiper(params);
  isSwiperData = SwiperRes.records.map((item: any) => {
    item.isSwiper = item.isSwiper == 0 ? '非轮播内容' : '轮播内容';
    return item;
  });
  console.log('isSwiperData', isSwiperData);
  showSwiper.value = true;
};
const changeSwiper = async (row: any, isSwiper: number) => {
  const params = {
    id: row.id,
    isSwiper: isSwiper,
  };

  const res: any = await updateIsSwiper(params);
  if (res.code == 200) {
    ElMessage.success('设置成功');
    await showSwiperlDialog(row);
    const params = {
      pageNum: 1,
      pageSize: 10,
      adminid: row.id,
    };

    isSwiperData = swiperRes.records;
    showSwiper.value = true;
  } else {
    ElMessage.error('设置失败');
  }
};
const closeswiper = () => {
  showSwiper.value = false;
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
  admin_account_num: '',
  id: null,
  admin_password: '',
  type: 1,
});
// 添加用户
const onSubmit = () => {
  userForm.value?.validate(async (valid: boolean) => {
    if (valid) {
      const request = action.value == 'add' ? addUser : updateUser;
      await request(formUser);
      dialogVisible.value = false;
      getUserData();
      action.value = '';
    }
  });
};

// 取消
const handleCancel = () => {
  dialogVisible.value = false;
};
// 区分编辑和新增
const action = ref('add');

const fileList = ref([]);
const requestFun = (files: any) => {
  console.log(files, '把文件给他');
  // 调用接口的 上传文件的
};
// 将审核状态转换回整数
const mapStateToInt = (type) => {
  return type === '子管理员' ? 1 : 0;
};
const handleEdit = (row: UserData) => {
  action.value = 'edit';
  dialogTitle.value = '编辑用户';
  dialogVisible.value = true;
  Object.assign(formUser, row);
  formUser.type = mapStateToInt(row.type);
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
</script>

<style lang="less" scoped>
.table {
  margin-top: 20px;
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
  display: flex;
  flex-direction: row-reverse;
}
</style>
