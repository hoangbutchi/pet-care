import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleService } from '../../services/roleService';
import PermissionGuard from '../../components/PermissionGuard';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Eye, Shield } from 'lucide-react';

const RoleList = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await roleService.getRoles();
      setRoles(data.roles || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi tải danh sách vai trò');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name, userCount) => {
    if (userCount > 0) {
      toast.warning(`Không thể xóa vai trò đang có ${userCount} nhân viên`);
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa vai trò "${name}"?`)) {
      return;
    }

    try {
      await roleService.deleteRole(id);
      toast.success('Xóa vai trò thành công');
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi xóa vai trò');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Vai trò</h1>
        </div>
        <PermissionGuard permission="create_role">
          <button
            onClick={() => navigate('/admin/roles/new')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <Plus className="w-4 h-4" />
            Tạo vai trò mới
          </button>
        </PermissionGuard>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : roles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có vai trò nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số nhân viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số quyền hạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{role.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {role.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{role.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {role.userCount || role._count?.users || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {role.permissionCount || role.permissions?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {role.isSystem ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          Hệ thống
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          Tùy chỉnh
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <PermissionGuard permission="view_roles">
                          <button
                            onClick={() => navigate(`/admin/roles/${role.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard permission="update_role">
                          <button
                            onClick={() => navigate(`/admin/roles/${role.id}/edit`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Chỉnh sửa"
                            disabled={role.isSystem}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard permission="delete_role">
                          <button
                            onClick={() =>
                              handleDelete(
                                role.id,
                                role.name,
                                role.userCount || role._count?.users || 0
                              )
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xóa"
                            disabled={role.isSystem}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </PermissionGuard>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleList;
