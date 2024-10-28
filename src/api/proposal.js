import axios from 'axios';

export const getProposalData = async (params) => {
  try {
    const response = await axios.get('http://101.201.105.132:8090/proposal/page', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch proposal data:', error);
    throw error;
  }
};

export const addProposal = async (params) => {
  try {
    const response = await axios.post(
      'http://101.201.105.132:8090/proposal/save',
      params
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add proposal:', error);
    throw error;
  }
};

export const editProposal = async (params) => {
  try {
    const response = await axios.post('http://101.201.105.132:8090/proposal/mod', params);
    return response.data;
  } catch (error) {
    console.error('Failed to edit proposal:', error);
    throw error;
  }
};

export const deleteProposal = async (params) => {
  try {
    const response = await axios.delete('http://101.201.105.132:8090/proposal/delete', {
      params: { id: params.id },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete proposal:', error);
    throw error;
  }
};

export const proposalUploadPicture = async (params) => {
  try {
    const response = await axios.post(
      'http://101.201.105.132:8090/file/proposalUploadPicture',
      params
    );
    return response.data;
  } catch (error) {
    console.error('Failed to upload proposal picture:', error);
    throw error;
  }
};

export const proposalUpload = async (params) => {
  try {
    const response = await axios.post(
      'http://101.201.105.132:8090/file/proposalUpload',
      params
    );
    return response.data;
  } catch (error) {
    console.error('Failed to upload proposal:', error);
    throw error;
  }
};

export const proposalComment = async (params) => {
  try {
    const response = await axios.get('http://101.201.105.132:8090/pc/pagePr', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch proposal comments:', error);
    throw error;
  }
};
// 删除图片
export const deleteProposalImg = async (params) => {
  try {
    const response = await axios.post(
      `http://101.201.105.132:8090/file/deleteProposalPicture?id=${params.id}`
    );
    return response.data;
  } catch (error) {
    console.error('删除提案图片失败:', error);
    throw error;
  }
};

// 删除文件
export const deleteProposalFile = async (params) => {
  try {
    const response = await axios.post(
      `http://101.201.105.132:8090/file/deleteProposal?id=${params.id}`
    );
    return response.data;
  } catch (error) {
    console.error('删除提案文件失败:', error);
    throw error;
  }
};
