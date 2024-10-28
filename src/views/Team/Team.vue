<template>
  <div class="container">
    <div class="sub-NormalUser-header">
      <el-button type="primary" @click="handleAdd">新建活动小组+</el-button>
      <el-input
        style="width: 500px"
        v-model="search.name"
        placeholder="请输入小组名称模糊搜索..."
      />
      <el-button type="primary" @click="getTeamData">搜索</el-button>
    </div>

    <el-table :data="data.list" style="height: 100%">
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
    :title="`${action === 'add' ? '新增' : '编辑'}小组`"
    width="40%"
    style="min-width: 300px"
    :show-close="false"
    @before-close="() => (action = '')"
  >
    <el-form label-position="top" label-width="100px" :model="formTeam" ref="teamForm">
      <el-form-item label="小组名称"></el-form-item>
      <el-form-item
        style="width: 100%"
        v-for="item in formItems"
        :key="item.prop"
        v-bind="item"
      >
        <component :is="item.render()" v-model="formTeam[item.prop]" />
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

import { TeamData, TeamSearch, TeamList } from './interface';
import { addTeam, deleteTeam, getTeams, updateTeam } from '@/api/team';

/**
 *  查询参数，page属性代表查询页码和一页的数量
 *  params 代表查询参数，name代表按照人名的模糊查询
 */
const search = reactive<TeamSearch>({
  pageNum: 1,
  pageSize: 20,
  name: '',
});
// 列表渲染接口返回的数据
const data = reactive<TeamList>({
  list: [],
  total: 0,
});
// 新增和修改表单的实例 ref
const teamForm = ref();
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
      label: '小组ID',
    },
    {
      prop: 'name',
      label: '小组名称',
    },

    {
      label: '操作',
      formatter: (row: TeamData) => {
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
      label: '小组名称',
      prop: 'name',
      rules: [{ required: true, message: '小组名称是必填项' }],
      render: () => <el-input placeholder="请输入小组名称" />,
    },
  ];
});

// 接口请求函数，这里的search就是查询参数，修改查询条件就是修改search的值
const getTeamData = async () => {
  let res: any = await getTeams(search);
  console.log(res);
  data.total = res.total;
  data.list = res.records;
};

// 同上
const changePage = (pageNum: number) => {
  search.pageNum = pageNum;
  getTeamData();
};

// 这里需要一个初始值是因为编辑用户的时候是吧列表当前row 赋给表单formUser，但是新增的时候，表单值需要清空，就可以将这个初始值赋给它
const initVlaue = {
  name: '', // 添加用户的 用户名
  id: '',
  state: '',
  avatar: 'null',
};
// 添加用户的form数据
const formTeam = reactive({ ...initVlaue });
// 添加用户
const onSubmit = () => {
  teamForm.value?.validate(async (valid: boolean) => {
    if (valid) {
      const request = action.value == 'add' ? addTeam : updateTeam;
      await request(formTeam);
      getTeamData();
      action.value = '';
    }
  });
};

// 区分编辑和新增
const action = ref('');
const fileList = ref([]);
const requestFun = (files: any) => {
  console.log(files, '把文件给他');
  // 调用接口的 上传文件的
};

const handleEdit = (row: TeamData) => {
  action.value = 'edit';
  Object.assign(formTeam, row);
};

const handleAdd = () => {
  action.value = 'add';
  Object.assign(formTeam, initVlaue);
  setTimeout(() => {
    teamForm.value?.clearValidate();
  });
};

// 删除用户
const handleDelete = (row: TeamData) => {
  ElMessageBox.confirm('你确定删除吗?').then(async () => {
    await deleteTeam(row.id);
    ElMessage({
      showClose: true,
      message: '删除成功',
      type: 'success',
    });
    getTeamData();
  });
};

onMounted(() => {
  getTeamData();
});
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
