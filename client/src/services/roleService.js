import axios from '../utils/axios';

export const roleService = {
  // Lấy danh sách vai trò
  getRoles: async () => {
    const response = await axios.get('/roles');
    return response.data;
  },

  // Lấy chi tiết vai trò
  getRoleById: async (id) => {
    const response = await axios.get(`/roles/${id}`);
    return response.data;
  },

  // Lấy quyền hạn của vai trò
  getRolePermissions: async (id) => {
    const response = await axios.get(`/roles/${id}/permissions`);
    return response.data;
  },

  // Tạo vai trò mới
  createRole: async (data) => {
    const response = await axios.post('/roles', data);
    return response.data;
  },

  // Cập nhật vai trò
  updateRole: async (id, data) => {
    const response = await axios.put(`/roles/${id}`, data);
    return response.data;
  },

  // Xóa vai trò
  deleteRole: async (id) => {
    const response = await axios.delete(`/roles/${id}`);
    return response.data;
  },
};
