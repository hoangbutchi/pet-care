import axios from '../utils/axios';

/**
 * Lấy danh sách email campaigns
 */
export const getCampaigns = async (params = {}) => {
  const response = await axios.get('/email/campaigns', { params });
  return response.data;
};

/**
 * Lấy chi tiết một campaign
 */
export const getCampaign = async (id) => {
  const response = await axios.get(`/email/campaigns/${id}`);
  return response.data;
};

/**
 * Tạo campaign mới
 */
export const createCampaign = async (data) => {
  const response = await axios.post('/email/campaigns', data);
  return response.data;
};

/**
 * Cập nhật campaign
 */
export const updateCampaign = async (id, data) => {
  const response = await axios.put(`/email/campaigns/${id}`, data);
  return response.data;
};

/**
 * Xóa campaign
 */
export const deleteCampaign = async (id) => {
  const response = await axios.delete(`/email/campaigns/${id}`);
  return response.data;
};

/**
 * Gửi campaign
 */
export const sendCampaign = async (id) => {
  const response = await axios.post(`/email/campaigns/${id}/send`);
  return response.data;
};

/**
 * Lấy danh sách recipients
 */
export const getRecipients = async (params = {}) => {
  const response = await axios.get('/email/recipients', { params });
  return response.data;
};
