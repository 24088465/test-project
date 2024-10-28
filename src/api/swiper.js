import axios from 'axios';

export const getIsSwiper = async (params) => {
  try {
    const response = await axios.get(
      'http://101.201.105.132:8090/admin/IsSwiperPageProposal',
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch IsSwiper data:', error);
    throw error;
  }
};

export const updateIsSwiper = async (params) => {
  try {
    const response = await axios.post(
      `http://101.201.105.132:8090/proposal/isSwiperExamine`,
      null,
      {
        params: {
          id: params.id,
          isSwiper: params.isSwiper,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update IsSwiper:', error);
    throw error;
  }
};
