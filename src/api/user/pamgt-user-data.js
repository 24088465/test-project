/* 整个项目的api管理 */
import request from '../request';

/**
 * 这里就是接口了，如果不mock数据，到这里就可以了，这里都是真正指向请求服务端的接口路径
 */
export const getUsers = (params) => {
  return request({
    url: 'subAdmin/page',
    method: 'GET',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};

export const deleteUser = (id) => {
  return request({
    url: `subAdmin/delete?id=${id}`,
    method: 'DELETE',
    // 使用mock模拟本地数据时关上
    mock: false,
  });
};

export const addUser = (params) => {
  return request({
    url: 'subAdmin/save',
    method: 'POST',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};

export const updateUser = (params) => {
  return request({
    url: 'subAdmin/mod',
    method: 'POST',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};
