import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import PermissionGuard from '../../components/PermissionGuard';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Edit,
  Key,
  CheckCircle,
  XCircle,
  MoreVertical,
  User,
  Briefcase,
  Clock,
  Shield,
} from 'lucide-react';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchEmployee();
    fetchActivity();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const data = await employeeService.getEmployeeById(id);
      setEmployee(data);
    } catch (error) {
      toast.error('Lỗi khi tải thông tin nhân viên');
      navigate('/admin/employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const data = await employeeService.getEmployeeActivity(id);
      setActivity(data.activities || []);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const handleResetPassword = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn reset mật khẩu cho nhân viên này?')) {
      return;
    }

    try {
      const data = await employeeService.resetPassword(id);
      toast.success(`Mật khẩu mới: ${data.tempPassword}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi reset mật khẩu');
    }
  };

  const handleToggleStatus = async () => {
    try {
      if (employee.isActive) {
        await employeeService.deactivateEmployee(id);
        toast.success('Vô hiệu hóa tài khoản thành công');
      } else {
        await employeeService.activateEmployee(id);
        toast.success('Kích hoạt tài khoản thành công');
      }
      fetchEmployee();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi thay đổi trạng thái');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!employee) {
    return <div className="p-6">Không tìm thấy nhân viên</div>;
  }

  const tabs = [
    { id: 'personal', label: 'Thông tin cá nhân', icon: User },
    { id: 'work', label: 'Thông tin công việc', icon: Briefcase },
    { id: 'activity', label: 'Lịch sử hoạt động', icon: Clock },
    { id: 'permissions', label: 'Quyền hạn', icon: Shield },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/employees')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-gray-600">{employee.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <PermissionGuard permission="update_employee">
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-lg ${
                employee.isActive
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {employee.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
            </button>
          </PermissionGuard>
          <PermissionGuard permission="update_employee">
            <button
              onClick={handleResetPassword}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Key className="w-4 h-4" />
              Reset mật khẩu
            </button>
          </PermissionGuard>
          <PermissionGuard permission="update_employee">
            <button
              onClick={() => navigate(`/admin/employees/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Employee Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-6">
          {employee.avatar ? (
            <img
              src={employee.avatar}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
              {employee.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold">
                {employee.firstName} {employee.lastName}
              </h2>
              {employee.isActive ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  Hoạt động
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                  <XCircle className="w-4 h-4" />
                  Không hoạt động
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Email:</span> {employee.email}
              </div>
              <div>
                <span className="font-medium">SĐT:</span> {employee.phone || '-'}
              </div>
              <div>
                <span className="font-medium">Vai trò:</span>{' '}
                {employee.role?.name || '-'}
              </div>
              <div>
                <span className="font-medium">Phòng ban:</span> {employee.department || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex gap-1 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Thông tin cá nhân</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employee.username ? `@${employee.username}` : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.phone || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ngày sinh</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employee.dateOfBirth
                        ? new Date(employee.dateOfBirth).toLocaleDateString('vi-VN')
                        : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employee.gender === 'MALE'
                        ? 'Nam'
                        : employee.gender === 'FEMALE'
                        ? 'Nữ'
                        : employee.gender === 'OTHER'
                        ? 'Khác'
                        : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.address || '-'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Work Info Tab */}
          {activeTab === 'work' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Thông tin công việc</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Mã nhân viên</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employee.employeeId || '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
                    <dd className="mt-1">
                      {employee.role ? (
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
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
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phòng ban</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.department || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Vị trí công việc</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee.position || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ngày bắt đầu làm việc</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employee.hireDate
                        ? new Date(employee.hireDate).toLocaleDateString('vi-VN')
                        : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Lương cơ bản</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employee.salary
                        ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(employee.salary)
                        : '-'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div>
              <h3 className="font-semibold mb-4">Lịch sử hoạt động</h3>
              <div className="space-y-3">
                {activity.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Chưa có hoạt động nào</p>
                ) : (
                  activity.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{act.action}</div>
                        <div className="text-sm text-gray-600">{act.resource}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(act.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div>
              <h3 className="font-semibold mb-4">Quyền hạn</h3>
              {employee.role ? (
                <div>
                  <h4 className="font-medium mb-2">Quyền hạn từ vai trò: {employee.role.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {employee.role.permissions.map((perm) => (
                      <div
                        key={perm.id}
                        className="p-3 bg-gray-50 rounded-lg text-sm"
                      >
                        {perm.displayName || perm.name}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Chưa có vai trò</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
