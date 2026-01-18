import axios from '../utils/axios';

export const permissionService = {
  // Lấy danh sách tất cả permissions
  getPermissions: async () => {
    const response = await axios.get('/permissions');
    return response.data;
  },

  // Lấy permissions nhóm theo resource
  getGroupedPermissions: async () => {
    const response = await axios.get('/permissions/grouped');
    return response.data;
  },

  // Lấy quyền hạn của user
  getUserPermissions: async (userId) => {
    const response = await axios.get(`/permissions/users/${userId}/permissions`);
    return response.data;
  },

  // Gán quyền riêng cho user
  assignUserPermissions: async (userId, permissionIds) => {
    const response = await axios.post(`/permissions/users/${userId}/permissions`, {
      permissionIds,
    });
    return response.data;
  },

  // Xóa quyền của user
  removeUserPermission: async (userId, permissionId) => {
    const response = await axios.delete(`/permissions/users/${userId}/permissions/${permissionId}`);
    return response.data;
  },
};
