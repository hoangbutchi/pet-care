import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PermissionGuard from '../components/PermissionGuard';
import {
    Users,
    Shield,
    Package,
    DollarSign,
    BarChart3,
    Settings,
    Calendar,
    ShoppingCart,
    Mail,
    MessageCircle,
    FileText,
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/appointments');
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!user) {
        return <div className="text-center mt-20 text-red-500 font-bold">Access Denied. Please login.</div>;
    }

    // Menu items với icons và permissions
    const menuItems = [
        {
            id: 'employees',
            title: 'Quản lý Nhân viên',
            description: 'Quản lý thông tin nhân viên, vai trò và quyền hạn',
            icon: Users,
            path: '/admin/employees',
            permission: 'view_employees',
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
        },
        {
            id: 'roles',
            title: 'Quản lý Vai trò',
            description: 'Cấu hình vai trò và phân quyền hệ thống',
            icon: Shield,
            path: '/admin/roles',
            permission: 'view_roles',
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            hoverColor: 'hover:from-purple-600 hover:to-purple-700',
        },
        {
            id: 'products',
            title: 'Quản lý Sản phẩm',
            description: 'Quản lý danh mục sản phẩm và thông tin chi tiết',
            icon: Package,
            path: '/admin/products',
            permission: 'view_products',
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            hoverColor: 'hover:from-green-600 hover:to-green-700',
        },
        {
            id: 'prices',
            title: 'Quản lý Giá',
            description: 'Thiết lập và quản lý giá sản phẩm',
            icon: DollarSign,
            path: '/admin/prices',
            permission: 'view_reports',
            color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
            hoverColor: 'hover:from-yellow-600 hover:to-yellow-700',
        },
        {
            id: 'inventory',
            title: 'Quản lý Kho',
            description: 'Theo dõi tồn kho và nhập xuất hàng',
            icon: BarChart3,
            path: '/admin/inventory',
            permission: 'manage_inventory',
            color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
            hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
        },
        {
            id: 'appointments',
            title: 'Lịch hẹn',
            description: 'Quản lý lịch hẹn và đặt khám',
            icon: Calendar,
            path: '/admin/appointments',
            permission: 'view_appointments',
            color: 'bg-gradient-to-br from-pink-500 to-pink-600',
            hoverColor: 'hover:from-pink-600 hover:to-pink-700',
        },
        {
            id: 'email',
            title: 'Email Marketing',
            description: 'Quản lý chiến dịch email marketing',
            icon: Mail,
            path: '/email-marketing',
            permission: 'view_reports',
            color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
            hoverColor: 'hover:from-cyan-600 hover:to-cyan-700',
        },
        {
            id: 'settings',
            title: 'Cài đặt',
            description: 'Cấu hình hệ thống và cài đặt',
            icon: Settings,
            path: '/admin/settings',
            permission: 'manage_settings',
            color: 'bg-gradient-to-br from-gray-500 to-gray-600',
            hoverColor: 'hover:from-gray-600 hover:to-gray-700',
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Quản lý hệ thống phòng khám thú y</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Lịch hẹn hôm nay</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Chờ xác nhận</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.filter(a => a.status === 'pending').length}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <FileText className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Đã xác nhận</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.filter(a => a.status === 'confirmed').length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Tổng lịch hẹn</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {appointments.length}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Menu Grid */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quản lý Hệ thống</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <PermissionGuard
                                key={item.id}
                                permission={item.permission}
                                hide={true}
                            >
                                <Link
                                    to={item.path}
                                    className={`${item.color} ${item.hoverColor} rounded-xl shadow-lg p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-sm text-white/90">{item.description}</p>
                                </Link>
                            </PermissionGuard>
                        );
                    })}
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Appointments Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Lịch hẹn gần đây</h2>
                        <Link
                            to="/booking"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {appointments.slice(0, 5).map(apt => (
                            <div
                                key={apt._id || apt.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-sm">
                                        {apt.pet?.name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {new Date(apt.date).toLocaleDateString('vi-VN')} - {apt.time}
                                    </p>
                                    <p className="text-xs text-gray-500">{apt.service}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    apt.status === 'confirmed' 
                                        ? 'bg-green-100 text-green-800' 
                                        : apt.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {apt.status === 'confirmed' ? 'Đã xác nhận' : 
                                     apt.status === 'pending' ? 'Chờ xác nhận' : 
                                     apt.status}
                                </span>
                            </div>
                        ))}
                        {appointments.length === 0 && (
                            <p className="text-center text-gray-500 py-4">Chưa có lịch hẹn nào</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Thao tác nhanh</h2>
                    <div className="space-y-3">
                        <PermissionGuard permission="create_employee">
                            <button
                                onClick={() => navigate('/admin/employees/new')}
                                className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                            >
                                <Users className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-900">Thêm nhân viên mới</span>
                            </button>
                        </PermissionGuard>
                        <PermissionGuard permission="create_role">
                            <button
                                onClick={() => navigate('/admin/roles/new')}
                                className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
                            >
                                <Shield className="w-5 h-5 text-purple-600" />
                                <span className="font-medium text-gray-900">Tạo vai trò mới</span>
                            </button>
                        </PermissionGuard>
                        <Link
                            to="/admin/products"
                            className="block w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                        >
                            <Package className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-900">Thêm sản phẩm mới</span>
                        </Link>
                        <Link
                            to="/booking"
                            className="block w-full flex items-center gap-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors text-left"
                        >
                            <Calendar className="w-5 h-5 text-pink-600" />
                            <span className="font-medium text-gray-900">Xem lịch hẹn</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
