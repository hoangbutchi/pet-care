import axios from '../utils/axios';

/**
 * Lấy danh sách consultations
 */
export const getConsultations = async (params = {}) => {
  const response = await axios.get('/consultations', { params });
  return response.data;
};

/**
 * Lấy chi tiết một consultation
 */
export const getConsultation = async (id) => {
  const response = await axios.get(`/consultations/${id}`);
  return response.data;
};

/**
 * Tạo consultation mới
 */
export const createConsultation = async (data) => {
  const response = await axios.post('/consultations', data);
  return response.data;
};

/**
 * Cập nhật consultation
 */
export const updateConsultation = async (id, data) => {
  const response = await axios.put(`/consultations/${id}`, data);
  return response.data;
};

/**
 * Xóa/hủy consultation
 */
export const deleteConsultation = async (id) => {
  const response = await axios.delete(`/consultations/${id}`);
  return response.data;
};

/**
 * Lấy danh sách available slots
 */
export const getAvailableSlots = async (consultantId, date, duration = 30) => {
  const response = await axios.get('/consultations/available-slots', {
    params: { consultantId, date, duration },
  });
  return response.data;
};

/**
 * Lấy danh sách consultants
 */
export const getConsultants = async () => {
  const response = await axios.get('/consultations/consultants');
  return response.data;
};
