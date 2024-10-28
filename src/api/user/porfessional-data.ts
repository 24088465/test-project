import { UserData, UserType } from '@/views/UserMgt/interface';
import Mock from 'mockjs';
import { FetchApi } from '../interface';

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url: string) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
}
/**
 * 这里就是mock的数据源，类似于数据库，增删改查操作在这里进行，你不需要关心，只要把方法抛出去
 */
let List: {
  id: string;
  name: string;
  status: UserType;
  addr: string;
  number: string;
  remark: string;
}[] = [];
const count = 100;

// 使用mock随机模拟接口数据
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      status: UserType.Professional,
      addr: Mock.Random.email(),
      number: '18656233125',
      remark: '',
    })
  );
}

export default {
  getUserList: (config: FetchApi) => {
    const { pageNum, pageSize,name } = JSON.parse(config.body); 
    const mockList = name ? List.filter((item) => item.name.includes(name)) : List;
    return {
      code: 200,
      data: {
        list: mockList.slice((pageNum - 1) * pageSize, pageNum * pageSize),
        count: mockList.length,
      },
    };
  },
  createUser: (config: FetchApi) => {
    const body = JSON.parse(config.body);
    List.unshift({
      ...body,
      id: Mock.Random.guid(),
    });
    return {
      code: 300,
      data: {
        message: '添加成功',
      },
    };
  },
  deleteUser: (config: FetchApi) => {
    const { id } = param2Obj(config.url);
    if (!id) {
      return {
        code: -999,
        message: '参数不正确',
      };
    } else {
      List.splice(
        List.findIndex((v) => v.id === id),
        1
      );
      return {
        code: 200,
        message: '删除成功',
      };
    }
  },
  updateUser: (config: FetchApi) => {
    const body = JSON.parse(config.body);
    const index = List.findIndex((v) => v.id === body.id);
    List[index] = body;
    return {
      code: 200,
      data: {
        message: '编辑成功',
      },
    };
  },
};
