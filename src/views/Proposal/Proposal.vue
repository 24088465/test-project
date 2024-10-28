<template>
  <!-- 提案列表 -->
  <!-- 顶部新建与搜索 -->
  <div class="user-header">
    <el-button type="primary" @click="handelAdd">新建+</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input v-model="formInline.keyword" placeholder="请输入提案名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 新建提案 -->
  <!-- 三元表达式
  :title="action == 'add' ? '新增用户' : '编辑用户'"
  -->
  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增提案' : '编辑提案'"
    width="500"
    :before-close="handleClose"
  >
    <!-- 新建表单 -->
    <el-form
      :model="formProposal"
      label-width="auto"
      ref="proposalForm"
      :rules="rules"
      style="max-width: 600px"
    >
      <el-form-item label="提案名称" prop="name">
        <el-input v-model="formProposal.name" />
      </el-form-item>
      <el-form-item label="提案地址" prop="address">
        <el-input v-model="formProposal.address" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-col :span="11">
          <el-date-picker
            v-model="formProposal.startTime"
            type="date"
            placeholder="开始日期"
            style="width: 100%"
          />
          <el-time-picker
            v-model="formProposal.startTime"
            placeholder="开始时间"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-col :span="2" class="text-center"></el-col>
      <el-form-item label="结束时间" prop="deadline">
        <el-col :span="11">
          <el-date-picker
            v-model="formProposal.deadline"
            type="date"
            placeholder="结束日期"
            style="width: 100%"
          />
          <el-time-picker
            v-model="formProposal.deadline"
            placeholder="结束时间"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="区域类型" prop="type">
        <el-checkbox-group v-model="formProposal.type">
          <el-checkbox value="商业区" name="type">商业区</el-checkbox>
          <el-checkbox value="工业区" name="type">工业区</el-checkbox>
          <el-checkbox value="科技区" name="type">科技区</el-checkbox>
          <el-checkbox value="居民区" name="type">居民区</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="提案详细" prop="content_text">
        <el-input v-model="formProposal.content_text" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 提案评论 -->
  <!-- 提案评论弹窗 -->
  <el-dialog v-model="dialogVisiblese" title="提案评论" width="800px">
    <el-table :data="listse">
      <el-table-column
        v-for="item in peopleCommentTable"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 125"
      />
      <!-- 图片列 -->
      <!--       <el-table-column label="提交图片" prop="content_picture" width="180">
        <template #default="scope">
          <a :href="`${scope.row.content_picture}`" target="_blank">
            <el-image
              :src="scope.row.content_picture"
              style="width: 100px; height: 100px"
            />
          </a>
        </template>
      </el-table-column> -->
      <!-- 文件列 -->
      <!-- <el-table-column label="提交文件" prop="content_document" width="180">
        <template #default="scope">
          <div v-if="scope.row.content_document">
            <a :href="`${scope.row.content_document}`" target="_blank">
              {{ scope.row.content_document.split('_').pop() }}
            </a>
          </div>
          <div v-else>暂无文件</div>
        </template>
      </el-table-column> -->
    </el-table>
  </el-dialog>
  <!-- 上传图片对话框 -->
  <el-dialog v-model="uploadDialogVisible" title="上传图片" width="500px">
    <el-upload
      :action="uploadUrl"
      :data="uploadData"
      :http-request="customRequest"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :on-change="handleChange"
      :on-preview="handlePreview"
      :before-remove="beforeRemove"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :file-list="fileList"
      list-type="picture"
    >
      <el-button type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="uploadDialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
  <!-- 上传文件对话框 -->
  <el-dialog v-model="uploadDialogVisibleD" title="上传文件" width="500px">
    <el-upload
      :action="uploadUrlD"
      :data="uploadDataD"
      :http-request="customRequestD"
      :on-success="handleUploadSuccessD"
      :on-error="handleUploadErrorD"
      :on-change="handleChangeD"
      :before-upload="beforeUploadD"
      :on-preview="handlePreviewD"
      :before-remove="beforeRemoveD"
      :on-remove="handleRemoveD"
      :file-list="fileList"
      multiple
    >
      <el-button type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
      </template>
    </el-upload>
    <!-- <el-button type="primary" @click="doClear">清空上传文件</el-button> -->
    <template #footer>
      <el-button @click="uploadDialogVisibleD = false">取消</el-button>
    </template>
  </el-dialog>
  <!-- 列表 -->
  <!-- 排序属性 
   default-sort="{prop: 'startTime', order: 'ascending'}"
   :sortable="item.prop === 'startTime' || item.prop === 'endTime'"
  -->
  <div class="table">
    <el-table :data="list" style="width: 100%" height="700px">
      <!-- 图片列 -->
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
      <!-- 文件列 -->
      <el-table-column label="提案文件" prop="content_document" width="180">
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
      <el-table-column
        :sortable="item.prop === 'startTime' || item.prop === 'deadline'"
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 125"
      />
      <el-table-column fixed="right" label="上传与清空" min-width="100">
        <template #default="scope">
          <div class="button-container">
            <el-button
              size="small"
              type="success"
              @click="handleUpload(scope.row)"
              style="margin-left: 12px"
            >
              上传图片
            </el-button>
            <el-button type="primary" size="small" @click="doClearImg(scope.row)">
              清空图片
            </el-button>
            <el-button type="warning" size="small" @click="handleUploadD(scope.row)">
              上传文件
            </el-button>
            <el-button type="primary" size="small" @click="doClear(scope.row)">
              清空文件
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="批量下载" min-width="180">
        <template #default="scope">
          <el-button
            @click="downloadAllFiles(scope.row.content_document)"
            type="primary"
            size="small"
          >
            下载文件
          </el-button>
          <el-button
            @click="downloadAllImages(scope.row.content_picture)"
            type="primary"
            size="small"
          >
            下载图片
          </el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="提案情况" min-width="90">
        <!-- #default="scope"插槽 -->
        <template #default="scope">
          <el-button size="small" plain type="primary" @click="handelComment(scope.row)">
            提案评论
          </el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handelDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--  @current-change 分页事件，事件前必须加@-->
    <el-pagination
      small
      background
      layout="prev, pager, next"
      :total="config.total"
      @current-change="changePage"
      class="pager mt-4"
    />
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance, onMounted, ref, reactive } from 'vue';
import {
  getProposalData,
  addProposal,
  editProposal,
  deleteProposal,
  proposalUpload,
  proposalUploadPicture,
  proposalComment,
  deleteProposalFile,
  deleteProposalImg,
} from '/src/api/proposal';
import axios from 'axios';
import store from '@/store/index.js';
import { ElMessageBox, ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
export default defineComponent({
  setup() {
    /* proxy:用于访问组件实例属性和方法的代理
       getCurrentInstance() 返回一个对象，其中包含了当前组件的各种属性和方法
    */
    const downloadAllImages = (content_picture) => {
      const urls = parseImageUrls(content_picture);
      urls.forEach((url, index) => {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = url;
          link.download = getFileName(url);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, index * 100); // 每个下载请求之间间隔 100 毫秒
      });
    };

    const downloadAllFiles = (content_document) => {
      const urls = parseDocumentUrls(content_document);
      urls.forEach((url, index) => {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = url;
          link.download = getFileName(url);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }, index * 100); // 每个下载请求之间间隔 100 毫秒
      });
    };
    const parseDocumentUrls = (content_document) => {
      if (!content_document) return [];
      // 去掉开头的逗号
      content_document = content_document.replace(/^,/, '');
      return content_document.split(',');
    };
    const parseImageUrls = (content_picture) => {
      if (!content_picture) return [];
      // 去掉开头的逗号
      content_picture = content_picture.replace(/^,/, '');
      return content_picture.split(',');
    };
    const getFileName = (url) => {
      const fileName = url.split('/').pop();
      // 使用正则表达式去掉 UUID
      return fileName.replace(/^[a-f0-9]{32}_/, '');
    };

    const proposalApi = {
      getProposalData,
      addProposal,
      editProposal,
      deleteProposal,
    };
    const { proxy } = getCurrentInstance();
    /* 表头数据设置 */
    let list = ref([]);
    const listse = ref([]);
    /* reactive:接收一个普通对象然后返回该普通对象的响应式代理 */
    const tableLabel = reactive([
      {
        prop: 'id',
        label: '提案id',
        width: 70,
      },
      {
        prop: 'isSwiper',
        label: '是否轮播',
        width: 100,
      },
      {
        prop: 'state',
        label: '审核状态',
        width: 80,
      },
      {
        prop: 'name',
        label: '提案名称',
        width: 100,
      },
      {
        prop: 'address',
        label: '地址',
      },
      {
        prop: 'type',
        label: '区域类型',
      },
      {
        prop: 'startTime',
        label: '开始时间',
        width: 180,
      },
      {
        prop: 'deadline',
        label: '结束时间',
        width: 180,
      },
      {
        prop: 'content_text',
        label: '提案详细',
        width: 180,
      },
      {
        prop: 'adminid',
        label: '子管理id',
      },
    ]);
    // 提案评论
    const peopleCommentTable = reactive([
      {
        prop: 'userid',
        label: '普通用户ID',
        width: 180,
      },
      {
        prop: 'content_text',
        label: '专业用户评论',
        width: 300,
      },
    ]);
    /*onMounted
      数据获取或其他初始化工作 */
    onMounted(() => {
      getProposalList(config);
    });
    /* 分页值 */
    const config = reactive({
      adminid: null,
      pageNum: 1, // 默认第一页
      pageSize: 10, // 默认每页10条
      name: '',
    });
    // 从permissio里获取子管理员id
    let id = store.state.token;
    /* 从api中调用后端方法 */
    const getProposalList = async (config) => {
      try {
        console.log('Request config:', config);
        config.adminid = id;
        let res = await getProposalData(config);
        config.total = res.total;
        list.value = res.records.map((item) => {
          item.state = item.state === 0 ? '审核未通过' : '审核通过';
          item.isSwiper = item.isSwiper === 0 ? '非轮播内容' : '轮播内容';
          item.type = item.type.split(',');
          return item;
        });
        console.log('List:', list.value);
        // 处理并映射响应数据
        console.log(res);
      } catch (error) {
        console.error('Error fetching proposal list:', error);
      }
    };
    // 将审核,轮播状态转换回整数
    const mapStateToInt = (state) => {
      return state === '审核未通过' ? 0 : 1;
    };
    const mapIsSwiperToInt = (isSwiper) => {
      return isSwiper === '非轮播内容' ? 0 : 1;
    };
    // 将区域类型从字符串转换回数组
    const mapTypeToArray = (type) => {
      return type ? type.split(',') : [];
    };

    // 将区域类型从数组转换为字符串
    const mapTypeToString = (type) => {
      return type.join(',');
    };
    /* 获取提案评论 */
    const configs = reactive({
      pageNum: 1, // 默认第一页
      pageSize: 10, // 默认每页10条
      proposalid: null,
    });
    const proposalCommentList = async (configs) => {
      let res = await proposalComment(configs);
      console.log(res);
      try {
        if (res && res.records) {
          configs.total = res.total;
          listse.value = res.records.map((item) => {
            return item;
          });
        } else {
          console.error('Unexpected response:', res);
        }
      } catch (error) {
        console.error('Failed ', error);
      }
    };
    const changePage = (page) => {
      console.log(page);
      config.pageNum = page; // 将改变的页数赋值给旧的页数值
      getProposalList(config); // 将新的页数值(config)传入数据请求方法更新数据
    };

    /* 搜索栏方法 */
    const formInline = reactive({
      keyword: '',
    });
    const handleSearch = () => {
      config.name = formInline.keyword || ''; // 如果关键词为空，传递空字符串
      config.pageNum = 1; // 重置分页
      getProposalList(config);
    };

    /* 空值新建框的显示隐藏方法 */
    const dialogVisible = ref(false);
    const dialogVisiblese = ref(false);
    const handleClose = (done) => {
      ElMessageBox.confirm('确定关闭吗？')
        .then(() => {
          /* 跟新提案列表数据
             防止编辑数据与新建数据重合
          */
          proxy.$refs.proposalForm.resetFields();
          done();
        })
        .catch(() => {
          // catch error
        });
    };
    /* 添加提案form数据 */
    const formProposal = reactive({
      adminid: null,
      name: '',
      address: '',
      type: [],
      startTime: '',
      deadline: '',
      content_text: '',
    });
    /* 规定form数据输入内容 */
    const rules = {
      name: [
        { required: true, message: '请输提案名称', trigger: 'blur' },
        { min: 1, max: 40, message: '名称规定长度为1-40字', trigger: 'blur' },
      ],
      address: [
        { required: true, message: '请输具体地址', trigger: 'blur' },
        { min: 2, max: 60, message: '地址规定长度为2-60字', trigger: 'blur' },
      ],
      type: [
        {
          required: true,
          message: '请选择提案类型',
          trigger: 'change',
        },
      ],
      content_text: [
        { required: true, message: '请输提案详细', trigger: 'blur' },
        {
          min: 0,
          max: 1000,
          message: '请输提案详细长度为0-1000字',
          trigger: 'blur',
        },
      ],
      startTime: [
        {
          type: 'date',
          required: true,
          message: '请选择开始日期和时间',
          trigger: 'change',
        },
      ],
      deadline: [
        {
          type: 'date',
          required: true,
          message: '请选择开始日期和时间',
          trigger: 'change',
        },
      ],
    };
    /* 格式化时间使得显示正确 */
    const timeFormat = (time) => {
      var time = new Date(time);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hour = add(time.getHours());
      var minute = add(time.getMinutes());
      /* 日格式 */
      function add(m) {
        return m < 10 ? '0' + m : m;
      }
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
    };
    /* 新建提案方法 */
    const onSubmit = () => {
      /* 提交校验 */
      /* validate 表单验证方法之一*
      判断变量valid是否满足条件*/
      proxy.$refs.proposalForm.validate(async (valid) => {
        if (valid) {
          if (action.value === 'add') {
            formProposal.adminid = id;
            /* 新建后端接口 */
            /* await和async成对出现，并且async因该在await上面的第一个回调函数 */
            formProposal.startTime = timeFormat(formProposal.startTime);
            formProposal.deadline = timeFormat(formProposal.deadline);
            formProposal.type = formProposal.type.join(',');
            /* 通过await调用新建提案方法传入数据 */
            let res = await addProposal(formProposal, rules);
            console.log(res);
            /* 添加后更新数据 */
            if (res) {
              /* 添加完成后将添加表关闭 */
              /* resetFields() 重置表单字段的状态 */
              dialogVisible.value = false;
              proxy.$refs.proposalForm.resetFields();
              /* 添加完后重新调用更新数据 */
              getProposalList(config);
            }
          } else {
            /* 编辑后端接口 */
            /* await和async成对出现，并且async因该在await上面的第一个回调函数 */
            formProposal.startTime = timeFormat(formProposal.startTime);
            formProposal.deadline = timeFormat(formProposal.deadline);
            formProposal.state = mapStateToInt(formProposal.state);
            formProposal.isSwiper = mapIsSwiperToInt(formProposal.isSwiper);
            formProposal.type = formProposal.type.join(',');
            /* 通过await调用编辑提案方法传入数据 */
            let res = await editProposal(formProposal, rules);
            console.log(res);
            /* 添加后更新数据 */
            if (res) {
              /* 添加完成后将添加表关闭 */
              /* resetFields() 重置表单字段的状态 */
              dialogVisible.value = false;
              proxy.$refs.proposalForm.resetFields();
              /* 添加完后重新调用更新数据 */
              getProposalList(config);
            }
          }
        } else {
          /* 提交错误提示 */
          ElMessage({
            showClose: true,
            message: '请输入正确的内容',
            type: 'error',
          });
        }
      });
    };
    /* 取消
      刷新新建提案的新建状态
       */
    const handleCancel = () => {
      /* 添加完成后将添加表关闭 */
      dialogVisible.value = false;
      proxy.$refs.proposalForm.resetFields();
    };
    /* 区分编辑和新增 */
    const action = ref('add');
    /* 编辑提案 */
    const handleEdit = (row) => {
      console.log(row);
      action.value = 'edit';
      dialogVisible.value = true;
      formProposal.state = mapStateToInt(row.state);
      formProposal.isSwiper = mapIsSwiperToInt(row.isSwiper);
      // 浅拷贝
      /*
        $nextTick作用：在下一次 DOM 更新结束后执行其指定的回调。
        什么时候用：当改变数据后，要基于更新后的新DOM进行某些操作时，
          要在nextTick所指定的回调函数中执行 */
      proxy.$nextTick(() => {
        Object.assign(formProposal, row);
      });
    };
    /* 提案评论 */
    const handelComment = async (row) => {
      console.log(row);
      configs.proposalid = row.id;
      proposalCommentList(configs);
      dialogVisiblese.value = true;
    };
    /* 新增提案 */
    const handelAdd = () => {
      action.value = 'add';
      dialogVisible.value = true;
    };
    /* 删除提案 */
    const handelDelete = (row) => {
      ElMessageBox.confirm('确定删除吗？')
        .then(async () => {
          await deleteProposal({
            id: row.id,
          });
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
          });
          /* 删除完后重新获取新的提案列表 */
          getProposalList(config);
        })
        .catch(() => {
          // catch error
        });
    };
    // 图片上传
    const uploadDialogVisible = ref(false);
    const uploadData = ref({});
    const uploadUrl = 'http://101.201.105.132:8090/file/proposalUploadPicture';
    const handleUpload = (row) => {
      uploadData.value = { id: Number(row.id) };
      uploadDialogVisible.value = true;
    };
    const handleUploadSuccess = (response, files, fileList) => {
      ElMessage({ showClose: true, message: '图片上传成功', type: 'success' });
      // uploadDialogVisible.value = false;
      // 在这里可以更新列表以显示新上传的文件
      getProposalList(config);
    };
    const handleUploadError = (err, files, fileList) => {
      ElMessage({ showClose: true, message: '图片上传失败', type: 'error' });
    };
    const handleChange = (files, fileList) => {
      console.log(files, fileList);
    };
    const beforeUpload = (files) => {
      // 在这里你可以检查文件类型、大小等
      return true; // 返回false将停止上传
    };
    const customRequest = async ({ file }) => {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('id', uploadData.value.id);
      const response = await proposalUploadPicture(formData);
    };
    // 文件预览
    const handlePreview = (row) => {
      console.log(row);
      window.open(row.fileUrl);
    };
    const handleImgDelete = async (row, isBeforeRemove = false) => {
      // try {
      //   await ElMessageBox.confirm('确定删除吗？', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //   });

      //   await proposalApi.deleteProposalImg({ id: row.id });

      //   ElMessage({
      //     showClose: true,
      //     message: '删除成功',
      //     type: 'success',
      //   });

      //   // 删除完后重新获取新的活动列表
      //   getProposalList(config);
      // } catch (error) {
      //   if (error !== 'cancel') {
      //     console.error('删除文件时出错:', error);
      //     ElMessage({
      //       type: 'error',
      //       message: '删除失败，请重试',
      //     });
      //   } else {
      //     ElMessage({
      //       type: 'info',
      //       message: '已取消删除',
      //     });
      //   }
      // }
    };

    // 图片删除前
    const beforeRemove = (row) => handleImgDelete(row, true);

    // 图片删除
    const handleRemove = (row) => handleImgDelete(row);
    // 上传文件
    const uploadDialogVisibleD = ref(false);
    const uploadDataD = ref({});
    const uploadUrlD = 'http://101.201.105.132:8090/file/ proposalUpload';
    const handleUploadD = (row) => {
      uploadDataD.value = { id: Number(row.id) };
      uploadDialogVisibleD.value = true;
    };
    const handleUploadSuccessD = (response, files, fileList) => {
      ElMessage({ showClose: true, message: '文件上传成功', type: 'success' });
      // uploadDialogVisibleD.value = false;
      // 在这里可以更新列表以显示新上传的文件
      getProposalList(config);
    };
    const handleUploadErrorD = (err, files, fileList) => {
      ElMessage({ showClose: true, message: '文件上传失败', type: 'error' });
    };
    const handleChangeD = (files, fileList) => {
      console.log(files, fileList);
    };
    const beforeUploadD = (files) => {
      // 在这里你可以检查文件类型、大小等
      return true; // 返回false将停止上传
    };
    // 自定义上传请求函数
    const customRequestD = async ({ file }) => {
      // 创建FormData对象用于发送文件
      const formData = new FormData();
      // 将文件添加到FormData
      formData.append('files', file);
      // 将活动ID添加到FormData
      formData.append('id', uploadDataD.value.id);
      // 调用活动上传API
      const response = await proposalUpload(formData);
      // 注意：这里没有处理响应，可能需要根据实际需求添加处理逻辑
    };

    const doClear = (row) => {
      ElMessageBox.confirm('确定清空所有上传文件吗？')
        .then(async () => {
          console.log(row);
          await deleteProposalFile({
            id: row.id,
          });
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
          });
          /* 删除完后重新获取新的活动列表 */
          getProposalList(config);
        })
        .catch((error) => {
          // catch error
          console.log(error);
        });
    };

    // 文件预览
    const handlePreviewD = (row) => {
      console.log(row);
      window.open(row.fileUrl);
    };
    // 文件删除前确认和执行删除操作
    const handleFileDelete = async (row, isBeforeRemove = false) => {
      // try {
      //   await ElMessageBox.confirm('确定删除吗？', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //   });

      //   await deleteProposalFile({ id: row.id });

      //   ElMessage({
      //     showClose: true,
      //     message: '删除成功',
      //     type: 'success',
      //   });

      //   // 删除完后重新获取新的活动列表
      //   getProposalList(config);
      // } catch (error) {
      //   if (error !== 'cancel') {
      //     console.error('删除文件时出错:', error);
      //     ElMessage({
      //       type: 'error',
      //       message: '删除失败，请重试',
      //     });
      //   } else {
      //     ElMessage({
      //       type: 'info',
      //       message: '已取消删除',
      //     });
      //   }
      // }
    };
    const doClearImg = (row) => {
      ElMessageBox.confirm('确定清空所有上传图片吗？')
        .then(async () => {
          console.log(row);
          await deleteProposalImg({
            id: row.id,
          });
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
          });
          /* 删除完后重新获取新的活动列表 */
          getProposalList(config);
        })
        .catch((error) => {
          // catch error
          console.log(error);
        });
    };

    // 文件删除前
    const beforeRemoveD = (row) => handleFileDelete(row, true);

    // 文件删除
    const handleRemoveD = (row) => handleFileDelete(row);
    return {
      list,
      tableLabel,
      config,
      formInline,
      handleSearch,
      changePage,
      dialogVisible,
      handleClose,
      formProposal,
      rules,
      onSubmit,
      handleCancel,
      handleEdit,
      handelAdd,
      handelDelete,
      action,
      uploadDialogVisible,
      uploadData,
      uploadUrl,
      handleUpload,
      handleUploadSuccess,
      handleUploadError,
      handleChange,
      beforeUpload,
      customRequest,
      uploadDialogVisibleD,
      uploadDataD,
      uploadUrlD,
      handleUploadSuccessD,
      handleUploadErrorD,
      handleChangeD,
      beforeUploadD,
      handleUploadD,
      customRequestD,
      doClear,
      peopleCommentTable,
      dialogVisiblese,
      handelComment,
      listse,
      getFileName,
      parseImageUrls,
      parseDocumentUrls,
      downloadAllFiles,
      downloadAllImages,
      handlePreview,
      beforeRemove,
      handleRemove,
      handlePreviewD,
      beforeRemoveD,
      handleRemoveD,
      handleFileDelete,
      doClearImg,
    };
  },
});
</script>
<style lang="less" scoped>
.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.image-container {
  max-height: 130px; /* 设置最大高度 */
  overflow-y: auto; /* 超过高度时显示滚动条 */
}

.table {
  position: relative;
  height: 620px;
  .pager {
    position: absolute;
    right: 0;
    bottom: -120px;
  }
}
.user-header {
  display: flex;
  justify-content: space-between;
  .el-form-item {
    margin-right: 5px;
  }
}
</style>
