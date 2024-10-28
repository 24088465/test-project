/* 整个项目的api管理 */
import request from '../request';

export const getUsers = (params) => {
  return request({
    url: '/user/page',
    method: 'GET',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};

export const deleteUser = (id) => {
  return request({
    url: `/user?id=${id}`,
    method: 'DELETE',
    // 使用mock模拟本地数据时关上
    mock: false,
  });
};

export const addUser = (params) => {
  return request({
    url: '/user',
    method: 'POST',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};

export const updateUser = (params) => {
  return request({
    url: '/user',
    method: 'PUT',
    // 使用mock模拟本地数据时关上
    mock: false,
    data: params,
  });
};
