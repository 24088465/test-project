export const getMenu = async (admin_account_num, admin_password) => {
  try {
    const response = await fetch('http://101.201.105.132:8090/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin_account_num: admin_account_num,
        admin_password: admin_password,
      }),
    });
    const data = await response.json();
    console.log('login', data.admin_account_num);

    if (response.ok && data.code === 200) {
      let menu;
      if (data.data.type === 1) {
        menu = [
          {
            path: '/home/SubHome',
            name: 'subHome',
            label: '首页',
            icon: 'house',
            url: 'home/SubHome',
          },
          {
            path: '/activity',
            name: 'activity',
            label: '活动管理',
            icon: 'user',
            url: 'Activity/Activity',
          },
          {
            path: '/proposal',
            name: 'proposal',
            label: '提案管理',
            icon: 'user',
            url: 'Proposal/Proposal',
          },
        ];
      } else if (data.data.type === 0) {
        menu = [
          {
            path: '/home/SupHome',
            name: 'supHome',
            label: '首页',
            icon: 'house',
            url: 'home/SupHome',
          },
          {
            path: '/Team',
            name: 'Team',
            label: '活动小组',
            icon: 'setting',
            url: 'Team/Team',
          },
          {
            label: '用户管理',
            icon: 'location',
            path: '/UserMgt',
            children: [
              {
                path: '/UserMgt/PAMgtUser',
                name: 'PAMgtUser',
                label: '子管理员用户',
                icon: 'setting',
                url: 'UserMgt/PAMgtUser',
              },
              {
                path: '/UserMgt/NormalUser',
                name: 'NormalUser',
                label: '普通用户',
                icon: 'setting',
                url: 'UserMgt/NormalUser',
              },
              {
                path: '/UserMgt/ProfessionalUser',
                name: 'ProfessionalUser',
                label: '专业用户',
                icon: 'setting',
                url: 'UserMgt/ProfessionalUser',
              },
            ],
          },
        ];
      }
      return {
        code: 200,
        data: {
          menu: menu,
          token: data.data.id,
          type: data.data.type,
          admin_account_num: data.data.admin_account_num,
        },
      };
    } else {
      return {
        code: data.code || -1,
        data: {
          message: data.message || '登录失败',
        },
      };
    }
  } catch (error) {
    console.error('登录请求出错：', error);
    return {
      code: -1,
      data: {
        message: '登录请求出错：' + error,
      },
    };
  }
};
