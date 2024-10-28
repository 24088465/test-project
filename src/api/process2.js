import axios from 'axios';

export const getProposalDatas = async (params) => {
  try {
    const response = await axios.get(
      'http://101.201.105.132:8090/admin/AuditingPageProposal',
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch proposal data:', error);
    throw error;
  }
};

export const updateProposal = async (params) => {
  try {
    const response = await axios.post(
      `http://101.201.105.132:8090/proposal/proposalExamine?id=${params.id}&state=${params.state}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update proposal:', error);
    throw error;
  }
};
