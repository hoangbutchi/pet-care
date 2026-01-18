import axios from '../utils/axios';

export const employeeService = {
  // Lấy danh sách nhân viên
  getEmployees: async (params = {}) => {
    const response = await axios.get('/employees', { params });
    return response.data;
  },

  // Lấy chi tiết nhân viên
  getEmployeeById: async (id) => {
    const response = await axios.get(`/employees/${id}`);
    return response.data;
  },

  // Tạo nhân viên mới
  createEmployee: async (data) => {
    const response = await axios.post('/employees', data);
    return response.data;
  },

  // Cập nhật nhân viên
  updateEmployee: async (id, data) => {
    const response = await axios.put(`/employees/${id}`, data);
    return response.data;
  },

  // Xóa nhân viên
  deleteEmployee: async (id) => {
    const response = await axios.delete(`/employees/${id}`);
    return response.data;
  },

  // Kích hoạt tài khoản
  activateEmployee: async (id) => {
    const response = await axios.patch(`/employees/${id}/activate`);
    return response.data;
  },

  // Vô hiệu hóa tài khoản
  deactivateEmployee: async (id) => {
    const response = await axios.patch(`/employees/${id}/deactivate`);
    return response.data;
  },

  // Reset mật khẩu
  resetPassword: async (id) => {
    const response = await axios.post(`/employees/${id}/reset-password`);
    return response.data;
  },

  // Lấy lịch sử hoạt động
  getEmployeeActivity: async (id, params = {}) => {
    const response = await axios.get(`/employees/${id}/activity`, { params });
    return response.data;
  },

  // Thao tác hàng loạt
  bulkAction: async (ids, action) => {
    const response = await axios.post('/employees/bulk-action', { ids, action });
    return response.data;
  },

  // Export danh sách
  exportEmployees: async () => {
    const response = await axios.get('/employees/export');
    return response.data;
  },
};
