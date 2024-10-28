import Mock from "mockjs";

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
  const search = url.split("?")[1];
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

let List = [];
const count = 200;

// 使用mock随机模拟接口数据
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      proposalId: Mock.Random.guid(),
      PadminId: Mock.Random.guid(),
      location: Mock.mock("@county(true)"),
      proposalName: Mock.mock("@ctitle()"),
      areaType: Mock.Random.pick(["商业区", "居民区", "工业区", "科技园区"]),
      startTime: Mock.mock("@datetime()"),
      endTime: Mock.mock("@datetime()"),
    })
  );
}

export default {
  // 模拟后端部分
  /**
   * 获取列表
   * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
   * @param name, page, limit
   * @return {{code: number, count: number, data: *[]}}
   */
  getUserList: (config) => {
    const { name, page = 1, limit = 20 } = param2Obj(config.url);
    const mockList = List.filter((item) => {
      if (name && item.proposalName.indexOf(name) === -1) return false;
      return true;
    });
    /* 后端分页 */
    const pageList = mockList.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1)
    );
    return {
      code: 200,
      data: {
        list: pageList,
        count: mockList.length,
      },
    };
  },
  /**
   * 增加用户
   * @param name, addr, ip, id, number, remark,password,status
   * @return {{code: number, data: {message: string}}}
   */
  createUser: (config) => {
    const {
      location,
      proposalName,
      areaType,
      startTime,
      endTime,
      proposalDetails,
    } = JSON.parse(config.body);
    console.log(JSON.parse(config.body));
    List.unshift({
      proposalId: Mock.Random.guid(),
      PadminId: Mock.Random.guid(),
      location: location,
      proposalName: proposalName,
      areaType: areaType,
      startTime: startTime,
      endTime: endTime,
      proposalDetails: proposalDetails,
    });
    return {
      code: 300,
      data: {
        message: "添加成功",
      },
    };
  },
  /**
   * 删除用户
   * @param id
   * @return {*}
   */
  deleteUser: (config) => {
    const { proposalId } = param2Obj(config.url);
    if (!proposalId) {
      return {
        code: -999,
        message: "参数不正确",
      };
    } else {
      List = List.filter((a) => a.proposalId !== proposalId);
      return {
        code: 200,
        message: "删除成功",
      };
    }
  },
  /**
   * 批量删除
   * @param config
   * @return {{code: number, data: {message: string}}}
   */
  batchremove: (config) => {
    let { ids } = param2Obj(config.url);
    ids = ids.split(",");
    List = List.filter((u) => !ids.includes(u.id));
    return {
      code: 20000,
      data: {
        message: "批量删除成功",
      },
    };
  },
  /**
   * 修改用户
   * @param name,id, addr, ip, number, remark,password,status
   * @return {{code: number, data: {message: string}}}
   */
  updateUser: (config) => {
    const {
      proposalId,
      location,
      proposalName,
      areaType,
      startTime,
      endTime,
      proposalDetails,
    } = JSON.parse(config.body);

    List.some((a) => {
      if (a.proposalId === proposalId) {
        a.location = location;
        a.proposalName = proposalName;
        a.areaType = areaType;
        a.startTime = startTime;
        a.endTime = endTime;
        a.proposalDetails = proposalDetails;
        return true;
      }
    });
    return {
      code: 200,
      data: {
        message: "编辑成功",
      },
    };
  },
};
