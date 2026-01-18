import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import PermissionGuard from '../../components/PermissionGuard';
import { usePermission } from '../../hooks/usePermission';
import { toast } from 'react-toastify';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  X,
  CheckCircle,
  XCircle,
  MoreVertical,
} from 'lucide-react';

const EmployeeList = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Roles for filter
  const [roles, setRoles] = useState([]);

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search,
        role: filterRole,
        status: filterStatus,
        department: filterDepartment,
      };

      const data = await employeeService.getEmployees(params);
      setEmployees(data.employees || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles for filter
  const fetchRoles = async () => {
    try {
      const { roleService } = await import('../../services/roleService');
      const data = await roleService.getRoles();
      setRoles(data.roles || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, search, filterRole, filterStatus, filterDepartment]);

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle bulk action
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một nhân viên');
      return;
    }

    try {
      await employeeService.bulkAction(selectedIds, action);
      toast.success(`Thực hiện ${action === 'activate' ? 'kích hoạt' : action === 'deactivate' ? 'vô hiệu hóa' : 'xóa'} thành công`);
      setSelectedIds([]);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi thực hiện thao tác');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      return;
    }

    try {
      await employeeService.deleteEmployee(id);
      toast.success('Xóa nhân viên thành công');
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi xóa nhân viên');
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const data = await employeeService.exportEmployees();
      // Convert to CSV
      const headers = ['Họ', 'Tên', 'Email', 'Số điện thoại', 'Vai trò', 'Phòng ban', 'Trạng thái'];
      const rows = data.employees.map((emp) => [
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.phone || '',
        emp.role?.name || '',
        emp.department || '',
        emp.isActive ? 'Hoạt động' : 'Không hoạt động',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast.success('Export thành công');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi export');
    }
  };

  // Handle toggle select
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === employees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(employees.map((emp) => emp.id));
    }
  };

  // Get unique departments
  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Nhân viên</h1>
        <div className="flex gap-2">
          <PermissionGuard permission="view_employees">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </PermissionGuard>
          <PermissionGuard permission="create_employee">
            <button
              onClick={() => navigate('/admin/employees/new')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Plus className="w-4 h-4" />
              Thêm nhân viên
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 items-center mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Lọc
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Tất cả</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.slug}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Tất cả</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            {(filterRole || filterStatus || filterDepartment) && (
              <div className="col-span-3 flex justify-end">
                <button
                  onClick={() => {
                    setFilterRole('');
                    setFilterStatus('');
                    setFilterDepartment('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="mt-4 pt-4 border-t flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Đã chọn {selectedIds.length} nhân viên
            </span>
            <div className="flex gap-2">
              <PermissionGuard permission="update_employee">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Kích hoạt
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Vô hiệu hóa
                </button>
              </PermissionGuard>
              <PermissionGuard permission="delete_employee">
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </PermissionGuard>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không có nhân viên nào
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === employees.length && employees.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số điện thoại
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng ban
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tham gia
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(employee.id)}
                          onChange={() => toggleSelect(employee.id)}
                          className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {employee.avatar ? (
                            <img
                              src={employee.avatar}
                              alt={`${employee.firstName} ${employee.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                              {employee.firstName?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            {employee.username && (
                              <div className="text-sm text-gray-500">@{employee.username}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{employee.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{employee.phone || '-'}</td>
                      <td className="px-4 py-3">
                        {employee.role ? (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              employee.role.slug === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : employee.role.slug === 'manager'
                                ? 'bg-blue-100 text-blue-800'
                                : employee.role.slug === 'veterinarian'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {employee.role.name}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {employee.department || '-'}
                      </td>
                      <td className="px-4 py-3">
                        {employee.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3" />
                            Không hoạt động
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {employee.createdAt
                          ? new Date(employee.createdAt).toLocaleDateString('vi-VN')
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <PermissionGuard permission="view_employees">
                            <button
                              onClick={() => navigate(`/admin/employees/${employee.id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </PermissionGuard>
                          <PermissionGuard permission="update_employee">
                            <button
                              onClick={() => navigate(`/admin/employees/${employee.id}/edit`)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </PermissionGuard>
                          <PermissionGuard permission="delete_employee">
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Xóa"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
                <div className="text-sm text-gray-700">
                  Hiển thị {(page - 1) * limit + 1} đến {Math.min(page * limit, total)} của {total} kết quả
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Trước
                  </button>
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-1 border rounded ${
                            page === pageNum
                              ? 'bg-green-500 text-white border-green-500'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum}>...</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
