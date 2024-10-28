/* 环境配置文件 
   企业级项目三种环境：
   开发环境
   测试环境
   线上环境
*/
// 当前环境(线上环境)
const env = 'prod';

const EnvConfig = {
  development: {
    baseApi: 'http://101.201.105.132:8090',
    mockApi: 'https://mock.apifox.com/m1/4068509-0-default/api',
  },
  test: {
    baseApi: 'http://101.201.105.132:8090',
    mockApi: 'https://mock.apifox.com/m1/4068509-0-default/api',
  },
  prod: {
    baseApi: 'http://101.201.105.132:8090',
    mockApi: 'https://mock.apifox.com/m1/4068509-0-default/api',
  },
};

export default {
  env,
  // mock的总开关
  mock: false,
  //   ...  展开运算符
  ...EnvConfig[env],
};
