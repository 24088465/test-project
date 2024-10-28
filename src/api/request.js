import axios from 'axios';
import config from '../config';
import { ElMessage } from 'element-plus';

const NETWORK_ERROR = '网络请求异常，请稍候重试';

// 创建一个axios实例对象
const service = axios.create({
  baseURL: config.baseApi,
});

/* 请求拦截器 */
service.interceptors.request.use((req) => {
  // 可以自定义header
  // jwt-token认证的时候
  return req;
});

/* 响应拦截器 */
service.interceptors.response.use(
  (res) => {
    const { status, data, msg } = res;
    // 根据后端 协商
    if (status === 200) {
      return data;
    } else {
      // 网络请求错误
      ElMessage.error(msg || NETWORK_ERROR);
      return Promise.reject(msg || NETWORK_ERROR);
    }
  },
  (error) => {
    // 网络请求错误处理
    ElMessage.error(NETWORK_ERROR);
    return Promise.reject(NETWORK_ERROR);
  }
);

// 封装的核心函数
function request(options) {
  options.method = options.method || 'get';
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data;
  }

  // 对mock的处理
  let isMock = config.mock;
  if (typeof options.mock !== 'undefined') {
    isMock = options.mock;
  }

  // 根据环境设置 baseURL
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }

  return service(options);
}

export default request;
