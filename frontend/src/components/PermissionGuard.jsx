import { usePermission } from '../hooks/usePermission';

/**
 * Component bảo vệ route/UI dựa trên permissions
 * 
 * @param {Object} props
 * @param {string|string[]} props.permission - Permission hoặc mảng permissions cần kiểm tra
 * @param {boolean} props.requireAll - Nếu true, cần tất cả permissions. Nếu false, cần ít nhất 1 permission
 * @param {React.ReactNode} props.children - Children sẽ được render nếu có quyền
 * @param {React.ReactNode} props.fallback - Component sẽ được render nếu không có quyền (optional)
 * @param {boolean} props.hide - Nếu true, sẽ không render gì cả nếu không có quyền (thay vì render fallback)
 */
const PermissionGuard = ({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null,
  hide = false,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  // Kiểm tra quyền
  let hasAccess = false;

  if (permission) {
    // Single permission
    hasAccess = hasPermission(permission);
  } else if (permissions && Array.isArray(permissions)) {
    // Multiple permissions
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions);
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
  } else {
    // Không có permission nào được chỉ định, cho phép truy cập
    hasAccess = true;
  }

  if (!hasAccess) {
    if (hide) {
      return null;
    }
    return fallback;
  }

  return children;
};

export default PermissionGuard;
