import request from "./request";
export const getTeams = (params) =>{
    return request({
        url:`/team/page`,
        method:'GET',
        data:params,
    })
}
export const addTeam = (params) => {
    return request({
      url: '/team/save',
      method: 'POST',
      // 使用mock模拟本地数据时关上
      mock: false,
      data: params,
    });
  };
  
  export const updateTeam = (params) => {
    return request({
      url: '/team/mod',
      method: 'POST',
      // 使用mock模拟本地数据时关上
      mock: false,
      data: params,
    });
  };
  export const deleteTeam = (id) => {
    return request({
      url: `/team/delete?id=${id}`,
      method: 'DELETE',
      // 使用mock模拟本地数据时关上
      mock: false,
    });
  };
  