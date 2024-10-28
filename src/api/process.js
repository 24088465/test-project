import axios from 'axios';

export const getActivityDatas = async (params) => {
  try {
    const response = await axios.get(
      'http://101.201.105.132:8090/admin/AuditingPageActivity',
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch activity data:', error);
    throw error;
  }
};

export const updateActivity = async (params) => {
  try {
    const response = await axios.post(
      `http://101.201.105.132:8090/activity/activityExamine?id=${params.id}&state=${params.state}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update activity:', error);
    throw error;
  }
};
