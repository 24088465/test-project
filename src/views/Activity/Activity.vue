<template>
  <!-- 活动列表 -->
  <!-- 顶部新建与搜索 -->
  <div class="user-header">
    <el-button type="primary" @click="handelAdd">新建+</el-button>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input v-model="formInline.keyword" placeholder="请输入活动名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 新建活动 -->
  <!-- 三元表达式
  :title="action == 'add' ? '新增用户' : '编辑用户'"
  -->
  <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增活动' : '编辑活动'"
    width="500"
    :before-close="handleClose"
  >
    <!-- 新建表单 -->
    <el-form
      :model="formActivity"
      label-width="auto"
      ref="activityForm"
      :rules="rules"
      style="max-width: 600px"
    >
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="formActivity.name" />
      </el-form-item>
      <el-form-item label="活动地址" prop="address">
        <el-input v-model="formActivity.address"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-col :span="11">
          <el-date-picker
            v-model="formActivity.startTime"
            type="date"
            placeholder="开始日期"
            style="width: 100%"
          />
          <el-time-picker
            v-model="formActivity.startTime"
            placeholder="开始时间"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-col :span="2" class="text-center"></el-col>
      <el-form-item label="结束时间" prop="deadline">
        <el-col :span="11">
          <el-date-picker
            v-model="formActivity.deadline"
            type="date"
            placeholder="结束日期"
            style="width: 100%"
          />
          <el-time-picker
            v-model="formActivity.deadline"
            placeholder="结束时间"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="区域类型" prop="type">
        <el-checkbox-group v-model="formActivity.type">
          <el-checkbox label="商业区">商业区</el-checkbox>
          <el-checkbox label="工业区">工业区</el-checkbox>
          <el-checkbox label="科技区">科技区</el-checkbox>
          <el-checkbox label="居民区">居民区</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="活动详细" prop="content_text">
        <el-input v-model="formActivity.content_text" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 地图定位弹窗 -->
  <el-dialog v-model="showMapDialog" title="地图定位" @after-enter="initMap" width="60%">
    <div class="map-wrapper">
      <div id="panel"></div>
      <div
        style="
          position: absolute;
          top: 10px;
          height: 40px;
          left: 100px;
          width: 1500px;
          z-index: 999;
          display: flex;
        "
      >
        <el-input
          v-model="searchText"
          placeholder="请输入搜索关键字"
          id="searchInputId"
          style="width: 300px"
        />
      </div>
      <div id="amap" style="width: 100%; height: 400px"></div>
      <!-- 地图容器 -->
    </div>
  </el-dialog>

  <!-- 活动小组弹窗 -->
  <el-dialog v-model="activityTeamDialog" title="活动小组情况" width="430px">
    <el-table :data="listses" height="300" style="width: 100%">
      <el-table-column
        v-for="item in peopleTeamTable"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 125"
      />
      <!-- 添加按钮列 -->
      <el-table-column label="小组操作" width="200" fixed="right">
        <template #default="scope">
          <!-- scope.row 代表当前表格行的数据对象，包含该行所有列的值。
               在这里，它可能包含小组的id、name等属性，
               这些数据会被传递给 viewTeamMembers 方法用于查看特定小组的成员 -->
          <el-button @click="viewTeamMembers(scope.row)" type="primary" size="small">
            查看组员
          </el-button>
          <el-button @click="selectTeamConfirm(scope.row)" type="danger" size="small">
            选择此组
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <!-- 查看小组组员弹窗 -->
  <!-- 活动小组弹窗 -->
  <el-dialog
    v-model="viewTeamMembersDialog"
    title="小组组员"
    width="350px"
    :modal-append-to-body="false"
    :append-to-body="false"
    :style="{ top: '10%', left: '14%', margin: '0', position: 'absolute' }"
  >
    <el-button
      @click="addTeamMembers"
      type="primary"
      size="small"
      style="margin-left: 80%"
    >
      添加组员
    </el-button>
    <el-table :data="listsese" height="200">
      <el-table-column
        v-for="item in viewTeamMembersTable"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 125"
      />
      <el-table-column label="踢出">
        <template #default="scope">
          <el-button @click="handleExitConfirm(scope.row)" type="danger" size="small">
            退出
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <!-- 活动参加人数 -->
  <!-- 活动参加人数弹窗 -->
  <el-dialog v-model="activityJoinDialog" title="活动参加情况" width="800px">
    <el-button size="small" plain type="primary" @click="handlePeopleTeam()">
      选择小组
    </el-button>
    <el-table :data="lists" height="400">
      <el-table-column
        v-for="item in peopleTable"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 125"
      />
      <!-- #default="scope"插槽 -->

      <!-- 操作列 -->
      <el-table-column label="是否同意参加" width="200">
        <template #default="scope">
          <el-button @click="joinTeamWithConfirm(scope.row)" type="primary" size="small">
            参加
          </el-button>
          <el-button @click="exitTeamWithConfirm(scope.row)" type="danger" size="small">
            不同意参加
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <!-- 添加小组组员 -->
  <el-dialog
    v-model="addTeamMembersDialog"
    title="选择小组成员"
    width="690px"
    :modal-append-to-body="false"
    :append-to-body="false"
    :style="{ top: '15%', right: '8%', margin: '0', position: 'absolute' }"
  >
    <el-table :data="listseses" height="300">
      <el-table-column label="头像" prop="avatar" width="110">
        <template #default="scope">
          <div v-if="scope.row.avatar">
            <a :href="`${scope.row.avatar}`" target="_blank">
              <el-image :src="scope.row.avatar" style="width: 100px; height: 100px" />
            </a>
          </div>
          <div v-else>暂无头像</div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in ProfessionaUserTable"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 125"
      ></el-table-column>
      <!-- 操作列 -->
      <el-table-column label="加入小组" width="131">
        <template #default="scope">
          <el-button @click="handleJoinConfirm(scope.row)" type="primary" size="small">
            加入
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <!-- 活动评论 -->
  <!-- 活动评论弹窗 -->
  <el-dialog v-model="activityCommentDialog" title="活动评论" width="1500px">
    <el-button
      type="primary"
      size="small"
      style="margin-left: 91%"
      @click="downloadComment()"
    >
      批量下载
    </el-button>
    <el-table :data="listse">
      <el-table-column
        v-for="item in peopleCommentTable"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :width="item.width ? item.width : 125"
      />
      <!-- 图片列 -->
      <el-table-column label="活动图片" prop="content_picture" width="200">
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
      <el-table-column label="活动文件" prop="content_document" width="600">
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
      <template #default="scope">
        <el-button type="primary">点击上传</el-button>
      </template>
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
      <!-- 文件列 -->
      <el-table-column label="活动文件" prop="content_document" width="180">
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
      <el-table-column fixed="right" label="批量下载" min-width="100">
        <template #default="scope">
          <div class="button-container">
            <el-button
              @click="downloadAllFiles(scope.row.content_document)"
              type="primary"
              size="small"
              style="margin-left: 12px"
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
            <el-button @click="downloadComment(scope.row)" type="primary" size="small">
              下载评论
            </el-button>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        label="活动参加小组"
        min-width="110"
      ></el-table-column> -->
      <el-table-column fixed="right" label="活动情况" min-width="100">
        <!-- #default="scope"插槽 -->
        <template #default="scope">
          <div class="button-container">
            <el-button
              size="small"
              plain
              type="primary"
              style="margin-left: 12px"
              @click="handlePeople(scope.row)"
            >
              活动人数
            </el-button>
            <el-button
              type="warning"
              plain
              size="small"
              @click="handelComment(scope.row)"
            >
              活动评论
            </el-button>
            <el-button
              type="primary"
              size="small"
              style="margin-top: 10px"
              @click="showMap(scope.row)"
            >
              选择地址
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="180">
        <!-- #default="scope"插槽 -->
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

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
  reactive,
  onUnmounted,
  nextTick,
  watch,
} from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import store from '@/store/index.js';
import {
  getActivityData,
  addActivity,
  editActivity,
  deleteActivity,
  activityUploadPicture,
  activityUpload,
  activityJoin,
  activityComment,
  checkPeopleApply,
  rejectPeopleApply,
  getTeamInfo,
  addUserJoinTeam,
  getTeamJoin,
  exitUserJoinTeam,
  checkTeamApply,
  deleteActivityFile,
  deleteActivityImg,
  downloadActivityComment,
  uploadActivityAddress,
} from '/src/api/activity';
import { getUsers } from '../../api/user/porfessional';
import axios from 'axios';
import AMapLoader from '@amap/amap-jsapi-loader';
import logo from '@/assets/vue.svg';
export default defineComponent({
  setup() {
    /* proxy:用于访问组件实例属性和方法的代理
       getCurrentInstance() 返回一个对象，其中包含了当前组件的各种属性和方法
    */

    //  地图功能
    onMounted(async () => {
      await initMap();

      getActivityList(config);
    });
    window._AMapSecurityConfig = {
      serviceHost: 'http://101.201.105.132/_AMapService',
    };
    let map: any = null;
    let placeSearch,
      AMapObj: any,
      geocoder: {
        getAddress: (arg0: any, arg1: (status: any, result: any) => void) => void;
      };
    let mouseTool: any = null;
    let circleId = 1;
    let auto = ref('');
    let autoOptions = {
      input: 'searchInputId',
    };
    let searchText = ref('');
    let startName = ref('');
    let endName = ref('');
    let rule = ref('');
    watch(searchText, (newValue) => {
      console.log('输入框内容更新: ', newValue);
    });
    let routeArr = ref([]);
    let policy = ref('');

    async function initMap() {
      if (!showMapDialog.value) return;
      await AMapLoader.load({
        key: '4488f15fcb3d1639f9e5fef02236e33a',
        version: '1.4.15',
        plugins: [
          'AMap.ToolBar',
          'AMap.Scale',
          'AMap.Geolocation',
          'AMap.PlaceSearch',
          'AMap.Geocoder',
          'AMap.HawkEye',
          'AMap.MapType',
          'AMap.CircleEditor',
          'AMap.AutoComplete',
          'AMap.PlaceSearch',
          'AMap.Driving',
        ],
      }).then((AMap) => {
        AMapObj = AMap;
        map = new AMap.Map('amap', {
          zoom: 12,
          resizeEnable: true,
          /**
           * 创建AMap.Map对象时如果没有传入center参数
           * 地图也会自动定位到您所在城市并显示，这就是JS API的初始加载定位：无需传入对应参数就能获取大致的定位信息
           * 但是当写了center参数，那么地图也会显示到您传入的center参数对应的位置
           */
          center: [116.808934, 40.121733],
          // center: [116.397428, 39.90923],
          viewMode: '3D',
        });
        // 图层切换
        const mapType = new AMap.MapType();
        // 鹰眼
        const hawkEye = new AMap.HawkEye();
        // 缩放条
        const toolbar = new AMap.ToolBar({
          position: 'LT',
        });
        // 比例尺
        const scale = new AMap.Scale();
        // 定位
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        geocoder = new AMap.Geocoder({
          city: '全国',
        });
        map.addControl(geolocation); // 定位组件
        map.addControl(toolbar); // 放大缩小组件
        map.addControl(scale); // 比例尺
        map.addControl(hawkEye); // 鹰眼
        map.addControl(mapType); // 图层切换
        poiSearch();
        bindEvent();
      }).catch((error) => {
        console.error("地图加载失败", error);
      })
      ;
    }

    // 搜索
    const poiSearch = () => {
      auto.value = new AMapObj.AutoComplete(autoOptions);
      const placeSearch = new AMapObj.PlaceSearch({
        map: map,
        city: '', // 减小搜索范围至某个城市
        pageSize: 5, // 单页显示结果条数
        pageIndex: 1, // 页码
        citylimit: false, // 是否强制限制在设置的城市内搜索
        autoFitView: true,
        panel: 'panel', // 结果列表将在此容器中进行展示。出不来时设置样式z-inde: 999
      });
      console.log(placeSearch.panel);
      auto.value.on('select', function (e) {
        //针对选中的poi实现自己的功能
        placeSearch.search(e.poi.name);
      });
    };

    // 鼠标双击事件
    const doubleClick = (e) => {
      console.log(
        '您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ] 的位置双击了地图！'
      );
      const x = e.lnglat.getLng();
      const y = e.lnglat.getLat();
      showInfo(e, x, y);
    };

    // 鼠标移动事件
    const showInfoMove = () => {
      console.log('您移动了您的鼠标！');
    };

    // 鼠标点击事件
    const signClick = (e) => {
      console.log(
        '您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ] 的位置单击了地图！'
      );
      const x = e.lnglat.getLng();
      const y = e.lnglat.getLat();
      showInfo(e, x, y);
    };

    // 地图事件绑定
    const bindEvent = () => {
      console.log('事件绑定成功');
      map.on('click', signClick);
      // map.on('dblclick', doubleClick);
      // map.on('mousemove', showInfoMove);
    };

    // 信息窗体
    // 信息窗体
    const showInfo = (e: any, x: any, y: any) => {
      geocoder.getAddress(e.lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          const address = result.regeocode.formattedAddress;
          const infoContent = `
        <div style="padding:7px 0px 0px 0px;">
          <div class="global-header">当前位置</div>
          <p class='input-item'>经度: ${x}</p>
          <p class='input-item'>纬度: ${y}</p>
          <p class='input-item'>地址: ${address}</p>
          <button type="button" class="el-button el-button--primary el-button--small" id="uploadAddressBtn">上传此地址</button>
        </div>
      `;
          const infoWindow = new AMapObj.InfoWindow({
            content: infoContent,
          });
          infoWindow.open(map, new AMapObj.LngLat(x, y));

          // 绑定事件
          document.getElementById('uploadAddressBtn').onclick = () => {
            saveLocation(
              { id: configs.activityId },
              x.toString(),
              y.toString(),
              address.toString()
            ); // 传递活动 ID
          };
          console.log('地址获取成功:', address, x, y);
        } else {
          console.error('获取地址失败');
        }
      });
    };
    // 显示地图的函数
    const showMap = async (row) => {
      configs.activityId = row.id;
      showMapDialog.value = true; // 打开地图弹窗
      // 只传入id
      // 使用 nextTick 确保 DOM 渲染完成后再初始化地图
      nextTick(async () => {
        await initMap(); // 异步调用地图初始化，确保地图加载完成后再继续操作
      });
    };
    // 上传活动地址
    const saveLocation = (row, x, y, address) => {
      const params = {
        id: row.id,
        longitude: x,
        latitude: y,
        address: address,
      };
      uploadActivityAddress(params)
        .then((response) => {
          ElMessage({
            message: '地址上传成功',
            type: 'success',
          });
          getActivityList(config);
        })
        .catch((error) => {
          ElMessage({
            message: '地址上传失败',
            type: 'error',
          });
        });
    };

    onUnmounted(() => {
      map?.destroy();
    });
    const downLoadCommentJson = reactive({
      activityId: null,
    });

    const downloadComment = async (row) => {
      // 设置 activityid
      configs.activityid = row.id; // 假设 row.id 是你想要的活动 ID
      console.log(configs.activityid); // 打印活动 ID

      // 使用 configs.activityid 构建完整的下载链接
      const zipFileUrl = `http://101.201.105.132:8090/downloads?activityId=${configs.activityid}`; // 注意这里的参数名应与后端一致

      try {
        // 创建一个链接并下载压缩包
        const link = document.createElement('a');
        link.href = zipFileUrl; // 直接使用压缩包的 URL
        link.download = 'activity_files.zip'; // 设置下载文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('下载失败:', error);
        ElMessage.error('下载失败，请重试');
      }
    };
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

    const { proxy } = getCurrentInstance();
    /* 表头数据设置 */
    let list = ref([]);
    const lists = ref([]);
    const listse = ref([]);
    const listses = ref([]);
    const listsese = ref([]);
    const listseses = ref([]);
    /* reactive:接收一个普通对象然后返回该普通对象的响应式代理 */
    const tableLabel = reactive([
      {
        prop: 'id',
        label: '活动id',
        width: 70,
      },
      {
        prop: 'state',
        label: '审核状态',
        width: 100,
      },
      {
        prop: 'name',
        label: '活动名称',
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
        label: '活动详细',
        width: 180,
      },
      {
        prop: 'adminid',
        label: '子管理id',
      },
    ]);
    // 专业用户
    const ProfessionaUserTable = reactive([
      {
        prop: 'id',
        label: '专业用户id',
        width: 100,
      },
      {
        prop: 'name',
        label: '用户名',
        width: 80,
      },
      {
        prop: 'team',
        label: '所属小组id',
        width: 80,
      },
      {
        prop: 'account',
        label: '账号',
        width: 130,
      },
      {
        prop: 'gender',
        label: '性别',
        width: 60,
      },
    ]);
    //  小组组员
    const viewTeamMembersTable = reactive([
      {
        prop: 'id',
        label: '专业用户id',
        width: 100,
      },
      {
        prop: 'name',
        label: '用户名',
        width: 150,
      },
    ]);
    // 活动小组
    const peopleTeamTable = reactive([
      {
        prop: 'id',
        label: '小组id',
        width: 80,
      },
      {
        prop: 'name',
        label: '小组名称',
        width: 150,
      },
    ]);
    // 活动人数
    const peopleTable = reactive([
      {
        prop: 'userid',
        label: '专业用户账号',
        width: 180,
      },
      // {
      //   prop: 'team',
      //   label: '所属小组',
      //   width: 180,
      // },
      {
        prop: 'passstate',
        label: '是否通过',
        width: 180,
      },
      {
        prop: 'finishstate',
        label: '是否完成',
        width: 180,
      },
    ]);
    // 活动评论
    const peopleCommentTable = reactive([
      {
        prop: 'userid',
        label: '专业用户账号',
        width: 180,
      },
      {
        prop: 'content_text',
        label: '专业用户评论',
        width: 500,
      },
    ]);

    // /*onMounted
    //   数据获取或其他初始化工作 */
    // onMounted(() => {

    //   // getTeamInfoList(configse);
    //   // viewTeamMember(TeamJson)
    //   // activityJoinList(configs);
    // });
    const activityApi = {
      getActivityData,
      addActivity,
      editActivity,
      deleteActivity,
    };
    /* 分页值 */
    const config = reactive({
      adminid: null,
      name: null,
      pageNum: 1, // 默认第一页
      pageSize: 10, // 默认每页10条
    });
    // 从permissio里获取子管理员id
    let id = store.state.token;
    /* 从api中调用后端方法 */
    const getActivityList = async (config) => {
      try {
        console.log(id);
        config.adminid = id;
        let res = await activityApi.getActivityData(config);
        console.log(res);
        if (res && res.records) {
          config.total = res.total;
          list.value = res.records.map((item) => {
            item.state = item.state === 0 ? '审核未通过' : '审核通过';
            item.type = item.type ? item.type.split(',') : [];

            return item;
          });
        } else {
          console.error('Unexpected response:', res);
        }
      } catch (error) {
        console.error('Failed to fetch activity list:', error);
      }
    };
    // 将审核状态转换回整数
    const mapStateToInt = (state) => {
      return state === '审核未通过' ? 0 : 1;
    };
    // 将区域类型从字符串转换回数组
    const mapTypeToArray = (type) => {
      return type ? type.split(',') : [];
    };

    // 将区域类型从数组转换为字符串
    const mapTypeToString = (type) => {
      return type.join(',');
    };
    // 选中小组参加活动‘
    const selectTeam = async (row) => {
      const team = row.id;
      const activityid = configs.activityid;
      console.log(activityid);
      console.log(row);
      try {
        let res = await checkTeamApply({ team, activityid });
        if (res && res.code === 200) {
          activityJoinList(configs);
          ElMessage({
            message: '小组参加活动',
            type: 'success',
          });
        } else {
          ElMessage({
            message: '此小组无组员无法参加活动',
            type: 'error',
          });
          console.error('Unexpected response:', res);
        }
      } catch (error) {
        console.error('Failed to fetch activity list:', error);
      }
    };
    const selectTeamConfirm = async (row) => {
      // 显示确认弹窗
      ElMessageBox.confirm('确定选择此组参加此活动？', '选择此组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 用户点击 "确定" 时执行 joinTeam 方法
          selectTeam(row);
        })
        .catch(() => {
          // 用户点击 "取消" 时提示操作已取消
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };
    // 查看小组组员
    const TeamJson = reactive({
      pageNum: 1, // 默认第一页
      pageSize: 10, // 默认每页10条
      team: null,
    });
    const viewTeamMember = async (TeamJson) => {
      try {
        let res = await getTeamJoin(TeamJson);
        console.log(TeamJson);
        console.log(configs);
        console.log(res);
        if (res && res.records) {
          TeamJson.total = res.total;
          listsese.value = res.records.map((item) => {
            return item;
          });
        } else {
          console.error('意外的响应:', res);
        }
      } catch (error) {
        console.error('获取活动列表失败:', error);
      }
    };
    // 审核用户活动申请
    const joinTeam = async (row) => {
      const userid = row.userid;
      console.log(userid);
      try {
        const res = await checkPeopleApply({ userid });
        console.log(res);
        if (res && res.code === 200) {
          activityJoinList(configs);
          ElMessage({
            message: '同意成功',
            type: 'success',
          });
        } else {
          console.error('Unexpected response:', res);
        }
      } catch (error) {
        console.error('Failed to edit activity:', error);
      }
    };
    const joinTeamWithConfirm = async (row) => {
      // 显示确认弹窗
      ElMessageBox.confirm('确定同意该用户参加此活动？', '同意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 用户点击 "确定" 时执行 joinTeam 方法
          joinTeam(row);
        })
        .catch(() => {
          // 用户点击 "取消" 时提示操作已取消
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };
    // 拒绝用户活动申请
    const exitTeam = async (row) => {
      const userid = row.userid;
      console.log(userid);
      try {
        const res = await rejectPeopleApply({ userid });
        console.log(res);
        if (res && res.code === 200) {
          activityJoinList(configs);
          ElMessage({
            message: '拒绝成功',
            type: 'success',
          });
        } else {
          console.error('Unexpected response:', res);
        }
      } catch (error) {
        console.error('Failed to edit activity:', error);
      }
    };
    const exitTeamWithConfirm = async (row) => {
      // 显示确认弹窗
      ElMessageBox.confirm('确定不同意该用户参加此活动？', '不同意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 用户点击 "确定" 时执行 joinTeam 方法
          exitTeam(row);
        })
        .catch(() => {
          // 用户点击 "取消" 时提示操作已取消
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };
    // 获取专业用户
    const configss = reactive({
      pageNum: 1, // 默认第一页
      pageSize: 10, // 默认每页10条
    });
    const getProfessionalUserList = async (configss) => {
      let res = await getUsers(configss);
      console.log(res);
      try {
        if (res && res.records) configss.total = res.total;
        listseses.value = res.records.map((item) => {
          return item;
        });
      } catch (error) {
        console.error('Failed ', error);
      }
    };
    // 从小组踢出用户
    const handleExit = async (row) => {
      const id = row.id;
      const team = TeamJson.team; // 假设 listseses 是一个数组，取第一个元素的 id
      console.log(team);
      try {
        // 调用封装的请求方法，并传递参数
        let res = await exitUserJoinTeam({ id, team });
        console.log(res);
        if (res && res.code === 200) {
          viewTeamMember(TeamJson);
          ElMessage({
            message: '踢出成功',
            type: 'success',
          });
        } else {
          console.error('意外的响应:', res);
        }
      } catch (error) {
        console.error('请求失败:', error);
      }
    };
    const handleExitConfirm = async (row) => {
      // 显示确认弹窗
      ElMessageBox.confirm('确定从此组踢出该用户？', '踢出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 用户点击 "确定" 时执行 joinTeam 方法
          handleExit(row);
        })
        .catch(() => {
          // 用户点击 "取消" 时提示操作已取消
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };
    // 用户加入小组
    const handleJoin = async (row) => {
      console.log(row);
      // 获取所需的 id 和 team 值
      const id = row.id;
      const team = TeamJson.team; // 假设 listseses 是一个数组，取第一个元素的 id
      console.log(team);
      if (row.team) {
        ElMessage({
          message: '该用户已加入其他小组',
          type: 'warning',
        });
        return;
      }
      try {
        // 调用封装的请求方法，并传递参数
        let res = await addUserJoinTeam({ id, team });
        console.log(res);
        if (res && res.code === 200) {
          viewTeamMember(TeamJson);
          ElMessage({
            message: '加入成功',
            type: 'success',
          });
        } else {
          console.error('意外的响应:', res);
        }
      } catch (error) {
        console.error('请求失败:', error);
      }
    };
    const handleJoinConfirm = async (row) => {
      // 显示确认弹窗
      ElMessageBox.confirm('确定该用户参加此小组？', '加入', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 用户点击 "确定" 时执行 joinTeam 方法
          handleJoin(row);
        })
        .catch(() => {
          // 用户点击 "取消" 时提示操作已取消
          ElMessage({
            type: 'info',
            message: '已取消操作',
          });
        });
    };
    const addTeamMember = async (row) => {};

    /* 获取活动申请人数 */
    const configs = reactive({
      pageNum: 1, // 默认第一页
      pageSize: 10, // 默认每页10条
      activityid: null,
    });
    const activityJoinList = async (configs) => {
      let res = await activityJoin(configs);
      console.log(configs);
      console.log(res);
      try {
        if (res && res.records) {
          configs.total = res.total;
          lists.value = res.records.map((item) => {
            item.passstate = item.passstate === 0 ? '拒绝参加此活动' : '同意参加此活动';
            item.finishstate = item.finishstate === 2 ? '完成活动任务' : '未完成活动任务';
            return item;
          });
        } else {
          console.error('Unexpected response:', res);
        }
      } catch (error) {
        console.error('Failed ', error);
      }
    };
    const activityCommentList = async (configs) => {
      let res = await activityComment(configs);
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
    // 获取活动小组
    const configse = reactive({
      pageNum: 1, // 默认第一页
      pageSize: 10, // 默认每页10条
      //  activityid: null,
    });
    const getTeamInfoList = async (configse) => {
      let res = await getTeamInfo(configse);
      console.log(res);
      console.log(configse);
      console.log(listses);
      try {
        if (res && res.records) {
          activityJoinList(configs);
          console.log(configs);
          configse.total = res.total;
          listses.value = res.records.map((item) => {
            // 获取id属性并赋值给对象
            return item;
          });
        } else {
          console.error('Unexpected response:', res);
        }
      } catch (error) {
        console.error('Failed ', error);
      }
    };
    /* 分页方法 */
    const changePage = (page) => {
      console.log(page);
      config.pageNum = page; // 将改变的页数赋值给旧的页数值
      getActivityList(config); // 将新的页数值(config)传入数据请求方法更新数据
    };
    /* 搜索栏方法 */

    const formInline = reactive({
      keyword: '',
    });
    const handleSearch = () => {
      config.name = formInline.keyword || ''; // 如果关键词为空，传递空字符串
      config.pageNum = 1; // 重置分页
      getActivityList(config);
    };
    /* 空值新建框的显示隐藏方法 */
    const dialogVisible = ref(false);
    const activityJoinDialog = ref(false);
    const activityCommentDialog = ref(false);
    const activityTeamDialog = ref(false);
    const viewTeamMembersDialog = ref(false);
    const addTeamMembersDialog = ref(false);
    const showMapDialog = ref(false);
    const handleClose = (done) => {
      ElMessageBox.confirm('确定关闭吗？')
        .then(() => {
          /* 跟新活动列表数据
             防止编辑数据与新建数据重合
          */
          proxy.$refs.activityForm.resetFields();
          done();
        })
        .catch(() => {
          // catch error
        });
    };
    /* 添加活动form数据 */
    const formActivity = reactive({
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
        { required: true, message: '请输活动名称', trigger: 'blur' },
        { min: 1, max: 40, message: '名称规定长度为1-40字', trigger: 'blur' },
      ],
      address: [
        { required: true, message: '请输具体地址', trigger: 'blur' },
        { min: 2, max: 60, message: '地址规定长度为2-60字', trigger: 'blur' },
      ],
      type: [
        {
          required: true,
          message: '请选择活动类型',
          trigger: 'change',
        },
      ],
      content_text: [
        { required: true, message: '请输活动详细', trigger: 'blur' },
        {
          min: 0,
          max: 1000,
          message: '请输活动详细长度为0-1000字',
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
    /* 新建活动方法 */
    const onSubmit = () => {
      /* 提交校验 */
      /* validate 表单验证方法之一*
      判断变量valid是否满足条件*/
      proxy.$refs.activityForm.validate(async (valid) => {
        if (valid) {
          if (action.value === 'add') {
            formActivity.adminid = id;
            /* 新建后端接口 */
            /* await和async成对出现，并且async因该在await上面的第一个回调函数 */
            formActivity.startTime = timeFormat(formActivity.startTime);
            formActivity.deadline = timeFormat(formActivity.deadline);
            // if (!Array.isArray(formActivity.type)) {
            //   formActivity.type = formActivity.type.split(',');
            // }
            // formActivity.type = JSON.stringify(formActivity.type);
            // formActivity.type = formActivity.type.split(',');
            formActivity.type = formActivity.type.join(',');
            /* 通过await调用新建活动方法传入数据 */
            let res = await addActivity(formActivity, rules);
            console.log(res);
            /* 添加后更新数据 */
            if (res) {
              /* 添加完成后将添加表关闭 */
              /* resetFields() 重置表单字段的状态 */
              dialogVisible.value = false;
              proxy.$refs.activityForm.resetFields();
              /* 添加完后重新调用更新数据 */
              getActivityList(config);
            }
          } else {
            /* 编辑后端接口 */
            /* await和async成对出现，并且async因该在await上面的第一个回调函数 */
            formActivity.startTime = timeFormat(formActivity.startTime);
            formActivity.deadline = timeFormat(formActivity.deadline);
            formActivity.state = mapStateToInt(formActivity.state);
            formActivity.type = formActivity.type.join(',');

            /* 通过await调用编辑活动方法传入数据 */
            let res = await editActivity(formActivity, rules);
            console.log(res);
            /* 添加后更新数据 */
            if (res) {
              /* 添加完成后将添加表关闭 */
              /* resetFields() 重置表单字段的状态 */
              dialogVisible.value = false;
              proxy.$refs.activityForm.resetFields();
              /* 添加完后重新调用更新数据 */
              getActivityList(config);
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
    刷新新建活动的新建状态
    */
    const handleCancel = () => {
      /* 添加完成后将添加表关闭 */
      dialogVisible.value = false;
      proxy.$refs.activityForm.resetFields();
    };
    /* 区分编辑和新增 */
    const action = ref('add');
    /* 编辑活动 */
    const handleEdit = (row) => {
      console.log(row);
      action.value = 'edit';
      dialogVisible.value = true;
      formActivity.state = mapStateToInt(row.state); // 转换为整数
      // 浅拷贝
      /*
        $nextTick作用：在下一次 DOM 更新结束后执行其指定的回调。
        什么时候用：当改变数据后，要基于更新后的新DOM进行某些操作时，
          要在nextTick所指定的回调函数中执行 */
      proxy.$nextTick(() => {
        Object.assign(formActivity, row);
      });
    };
    // 查看小组组员
    const viewTeamMembers = async (row) => {
      console.log(row);
      TeamJson.team = row.id;
      viewTeamMembersDialog.value = true;
      viewTeamMember(TeamJson);
    };
    // 添加小组组员
    const addTeamMembers = async (row) => {
      console.log(row);
      getProfessionalUserList(configss);
      addTeamMembersDialog.value = true;
    };
    // 选择此小组
    // 活动小组
    const handlePeopleTeam = async (row) => {
      console.log(row);
      getTeamInfoList(configse);
      activityTeamDialog.value = true;
    };
    /* 活动人数 */
    const handlePeople = async (row) => {
      console.log(row);
      configs.activityid = row.id;
      activityJoinList(configs);
      activityJoinDialog.value = true;
    };
    /* 活动评论 */
    const handelComment = async (row) => {
      console.log(row);
      configs.activityid = row.id;
      activityCommentList(configs);
      activityCommentDialog.value = true;
    };
    /* 新增活动 */
    const handelAdd = () => {
      action.value = 'add';
      dialogVisible.value = true;
    };
    /* 删除活动 */
    const handelDelete = (row) => {
      ElMessageBox.confirm('确定删除吗？')
        .then(async () => {
          await activityApi.deleteActivity({
            id: row.id,
          });
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
          });
          /* 删除完后重新获取新的活动列表 */
          getActivityList(config);
        })
        .catch((error) => {
          // catch error
          console.log(error);
        });
    };
    // 图片上传
    const uploadDialogVisible = ref(false);
    const uploadData = ref({});
    const uploadUrl = 'http://101.201.105.132:8090/file/activityUploadPicture';
    const handleUpload = (row) => {
      uploadData.value = { id: Number(row.id) };
      uploadDialogVisible.value = true;
      console.log(row);
    };
    const handleUploadSuccess = (response, files, fileList) => {
      ElMessage({ showClose: true, message: '图片上传成功', type: 'success' });
      // uploadDialogVisible.value = false;
      // 在这里可以更新列表以显示新上传的文件
      getActivityList(config);
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
      console.log(formData);
      formData.append('files', file);
      formData.append('id', uploadData.value.id);
      const response = await activityUploadPicture(formData);
    };
    // 文件预览
    const handlePreview = (row) => {
      console.log(row);
      window.open(row.fileUrl);
    };
    const handleImgDelete = async (row, isBeforeRemove = false) => {
      // console.log('Deleting image with id:', row.activityid);
      // try {
      //   await ElMessageBox.confirm('确定删除吗？', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //   });
      //   console.log('Deleting image with id:', row.activityid);
      //   await deleteActivityImg({ id: row.activityid });
      //   ElMessage({
      //     showClose: true,
      //     message: '删除成功',
      //     type: 'success',
      //   });
      //   // 删除完后重新获取新的活动列表
      //   getActivityList(config);
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
    // 删除所有图片
    // 上传文件
    const uploadDialogVisibleD = ref(false);
    const uploadDataD = ref({});
    const uploadUrlD = 'http://101.201.105.132:8090/file/activityUpload';
    const handleUploadD = (row) => {
      console.log(row);
      uploadDataD.value = { id: Number(row.id) };
      uploadDialogVisibleD.value = true;
    };
    // 删除所有文件

    const handleUploadSuccessD = (response, files, fileList) => {
      ElMessage({ showClose: true, message: '文件上传成功', type: 'success' });
      // uploadDialogVisibleD.value = false;
      // 在这里可以更新列表以显示新上传的文件
      getActivityList(config);
    };
    const handleUploadErrorD = (err, files, fileList) => {
      ElMessage({ showClose: true, message: '文件上传失败', type: 'error' });
    };
    const handleChangeD = (files, fileList, id) => {
      console.log(files, fileList, id);
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
      const response = await activityUpload(formData);
      // 注意：这里没有处理响应，可能需要根据实际需求添加处理逻辑
    };

    const doClear = (row) => {
      ElMessageBox.confirm('确定清空所有上传文件吗？')
        .then(async () => {
          console.log(row);
          await deleteActivityFile({
            id: row.id,
          });
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
          });
          /* 删除完后重新获取新的活动列表 */
          getActivityList(config);
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

    const doClearImg = (row) => {
      ElMessageBox.confirm('确定清空所有上传图片吗？')
        .then(async () => {
          console.log(row);
          await deleteActivityImg({
            id: row.id,
          });
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success',
          });
          /* 删除完后重新获取新的活动列表 */
          getActivityList(config);
        })
        .catch((error) => {
          // catch error
          console.log(error);
        });
    };
    // 文件删除前确认和执行删除操作
    const handleFileDelete = async (row, isBeforeRemove = false) => {
      // try {
      //   console.log(row);
      //   await ElMessageBox.confirm('确定删除吗？', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //   });
      //  await deleteActivityFile({ id: row.id });
      //   ElMessage({
      //     showClose: true,
      //     message: '删除成功',
      //     type: 'success',
      //   });
      //   // 删除完后重新获取新的活动列表
      //   getActivityList(config);
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

    // 文件删除前
    const beforeRemoveD = (row) => handleFileDelete(row, true);

    // 文件删除
    const handleRemoveD = (row) => handleFileDelete(row);
    return {
      handleImgDelete,
      handleFileDelete,
      action,
      activityCommentDialog,
      activityJoinDialog,
      activityTeamDialog,
      addTeamMember,
      addTeamMembers,
      addTeamMembersDialog,
      beforeUpload,
      beforeUploadD,
      changePage,
      config,
      configse,
      configss,
      customRequest,
      customRequestD,
      dialogVisible,
      doClear,
      formActivity,
      formInline,
      getProfessionalUserList,
      getTeamInfoList,
      getTeamJoin,
      handelAdd,
      handelComment,
      handelDelete,
      handleCancel,
      handleChange,
      beforeRemoveD,
      handleChangeD,
      handleClose,
      handleEdit,
      handleJoin,
      handleExit,
      handleExitConfirm,
      handlePeople,
      handlePeopleTeam,
      handlePreview,
      handlePreviewD,
      handleRemove,
      handleRemoveD,
      handleSearch,
      handleUpload,
      handleUploadD,
      handleUploadError,
      handleUploadErrorD,
      handleUploadSuccess,
      handleUploadSuccessD,
      joinTeam,
      exitTeam,
      list,
      lists,
      listse,
      listses,
      listsese,
      listseses,
      onSubmit,
      peopleCommentTable,
      peopleTable,
      peopleTeamTable,
      ProfessionaUserTable,
      rules,
      rejectPeopleApply,
      tableLabel,
      uploadData,
      uploadDataD,
      uploadDialogVisible,
      uploadDialogVisibleD,
      uploadUrl,
      uploadUrlD,
      viewTeamMember,
      viewTeamMembers,
      viewTeamMembersDialog,
      viewTeamMembersTable,
      selectTeam,
      selectTeamConfirm,
      exitTeamWithConfirm,
      joinTeamWithConfirm,
      handleJoinConfirm,
      parseImageUrls,
      getFileName,
      parseDocumentUrls,
      downloadAllFiles,
      downloadAllImages,
      doClearImg,
      downloadComment,
      downLoadCommentJson,
      showMapDialog,
      showMap,
      saveLocation,
      uploadActivityAddress,
    };
  },
});
</script>

<style lang="less" scoped>
.map-wrapper {
  #amap {
    width: 100%;
    height: 100vh;
  }
}
#map {
  width: 100%;
  height: 800px;
}


#panel {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
}
.draw-area {
  position: absolute;
  bottom: 10px;
  right: 200px;
  display: flex;
  justify-content: center;
  .select {
    background-color: white;
    padding: 0 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .action {
    display: flex;
    align-items: center;
  }
}
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
