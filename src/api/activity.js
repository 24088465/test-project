import request from './request';
import axios from 'axios';
//acticity组件
// export const getActivityData = async (config) => {
//   try {
//     const response = await axios.get('http://101.201.105.132:8090/activity/page', {
//       params: {
//         name: config.name, // 可选参数
//         pageNum: config.pageNum, // 必填参数
//         pageSize: config.pageSize, // 必填参数
//         adminid: config.adminid,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch proposal data:', error);
//     throw error;
//   }
// };
export const getActivityData = (params) => {
  return request({
    url: '/activity/page',
    method: 'GET',
    data: params,
    mock: false,
  });
};

export const addActivity = (params) => {
  return request({
    url: '/activity/save',
    method: 'POST',
    data: params,
    // 使用mock模拟本地数据时关上
    mock: false,
  });
  /*  if (res.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.message)); */
};

export const editActivity = (params) => {
  return request({
    url: '/activity/mod',
    method: 'POST',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};
export const deleteActivity = (params) => {
  return request({
    url: `/activity/delete`, // 不包含 id，在 data 中传递
    method: 'DELETE',
    // 使用mock模拟本地数据时关上
    mock: false,
    params: { id: params.id }, // 使用 params 传递查询参数
  });
};
export const activityUploadPicture = (params) => {
  return request({
    url: '/file/activityUploadPicture',
    method: 'POST',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};

export const activityUpload = (params) => {
  return request({
    url: 'file/activityUpload',
    method: 'POST',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};

// 活动参加人数情况
export const activityJoin = (params) => {
  return request({
    url: 'aj/page',
    method: 'GET',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};
// 活动评论
export const activityComment = (params) => {
  return request({
    url: 'ac/pageAc',
    method: 'GET',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};

// 获取小组信息
export const getTeamInfo = (params) => {
  return request({
    url: '/team/page',
    method: 'GET',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};

// 获取小组参与人员
export const getTeamJoin = (params) => {
  return request({
    url: '/pfuser/pageTeam',
    method: 'GET',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};

// 审核个人专业用户活动申请
export const checkPeopleApply = (params) => {
  return request({
    url: `/aj/pass?userid=${params.userid}`,
    method: 'POST',
  });
};
export const rejectPeopleApply = (params) => {
  return request({
    url: `/aj/Nopass?userid=${params.userid}`,
    method: 'POST',
  });
};
// 添加小组组员到小组
export const addUserJoinTeam = (params) => {
  return request({
    url: `/pfuser/team?id=${params.id}&team=${params.team}`,
    method: 'POST',
  });
};
// 从踢出小组里踢出小组
export const exitUserJoinTeam = (params) => {
  return request({
    url: `/pfuser/outTeam?id=${params.id}&team=${params.team}`,
    method: 'POST',
  });
};

// 选中小组参加活动
export const checkTeamApply = (params) => {
  return request({
    url: `/aj/TeamSave?team=${params.team}&activityid=${params.activityid}`,
    method: 'POST',
  });
};

// 删除图片
export const deleteActivityImg = (params) => {
  return request({
    url: `/file/deleteActivityPicture?id=${params.id}`,
    method: 'POST',
  });
};
// 删除文件
export const deleteActivityFile = (params) => {
  return request({
    url: `/file/deleteActivity?id=${params.id}`,
    method: 'POST',
  });
};

// 批量下载活动评论内容
export const downloadActivityComment = (params) => {
  return axios.get('http://101.201.105.132:8090/downloads', {
    params: {
      activityId: params.activityId
    },
    responseType: 'text' // 确保 axios 解析为文本
  });
};
// 上传活动地址经纬度
export const uploadActivityAddress = (params) => {
  return request({
    url: `/activity/saveAddress?id=${params.id}&latitude=${params.latitude}&longitude=${params.longitude}&address=${params.address}`,
    method: 'POST',
    // 使用mock模拟本地数据时关上
    mock: false,
  });
};
