import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook để kiểm tra quyền hạn của user
 */
export const usePermission = () => {
  const { user } = useAuth();

  // Lấy danh sách permissions từ user
  const permissions = useMemo(() => {
    if (!user) return [];

    // Lấy permissions từ user object
    // Có thể là user.permissions hoặc user.user.permissions tùy vào cách backend trả về
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions;
    }

    if (user.user && user.user.permissions && Array.isArray(user.user.permissions)) {
      return user.user.permissions;
    }

    // Fallback: Nếu user có role admin, trả về '*' (tất cả quyền)
    if (user.user?.role?.slug === 'admin' || user.role?.slug === 'admin') {
      return ['*'];
    }

    return [];
  }, [user]);

  /**
   * Kiểm tra user có permission cụ thể không
   * @param {string} permission - Tên permission cần kiểm tra
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    if (!permission) return false;

    // Admin có toàn quyền
    if (permissions.includes('*')) return true;

    return permissions.includes(permission);
  };

  /**
   * Kiểm tra user có ít nhất 1 trong các permissions không
   * @param {string[]} permissionList - Mảng các permissions
   * @returns {boolean}
   */
  const hasAnyPermission = (permissionList) => {
    if (!Array.isArray(permissionList) || permissionList.length === 0) return false;

    // Admin có toàn quyền
    if (permissions.includes('*')) return true;

    return permissionList.some((perm) => permissions.includes(perm));
  };

  /**
   * Kiểm tra user có tất cả các permissions không
   * @param {string[]} permissionList - Mảng các permissions
   * @returns {boolean}
   */
  const hasAllPermissions = (permissionList) => {
    if (!Array.isArray(permissionList) || permissionList.length === 0) return true;

    // Admin có toàn quyền
    if (permissions.includes('*')) return true;

    return permissionList.every((perm) => permissions.includes(perm));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
