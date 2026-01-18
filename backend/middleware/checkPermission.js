const prisma = require('../prismaClient');

/**
 * Middleware kiểm tra quyền hạn của user
 * @param {String|Array} requiredPermission - Quyền cần thiết hoặc mảng các quyền
 * @param {Object} options - Options: { requireAll: false } - Nếu là mảng, requireAll = true thì cần tất cả, false thì cần ít nhất 1
 */
const checkPermission = (requiredPermission, options = {}) => {
  return async (req, res, next) => {
    try {
      // Lấy userId từ JWT token (đã được set bởi protect middleware)
      if (!req.user || !req.user.id) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Vui lòng đăng nhập' 
        });
      }

      const userId = req.user.id;
      const permissions = Array.isArray(requiredPermission) 
        ? requiredPermission 
        : [requiredPermission];
      const requireAll = options.requireAll || false;

      // Lấy user với role và permissions
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          role: {
            include: {
              permissions: true
            }
          },
          permissions: {
            include: {
              permission: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ 
          error: 'NotFound',
          message: 'Không tìm thấy user' 
        });
      }

      // Admin có toàn quyền
      if (user.role && user.role.slug === 'admin') {
        return next();
      }

      // Nếu user không có role, không có quyền
      if (!user.role) {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: 'Bạn không có quyền thực hiện hành động này' 
        });
      }

      // Lấy tất cả permissions của user (từ role + user-specific)
      const rolePermissions = user.role.permissions.map(p => p.name);
      const userPermissions = user.permissions.map(up => up.permission.name);
      const allPermissions = [...new Set([...rolePermissions, ...userPermissions])];

      // Kiểm tra quyền
      let hasPermission = false;
      if (requireAll) {
        // Cần tất cả các quyền
        hasPermission = permissions.every(perm => allPermissions.includes(perm));
      } else {
        // Cần ít nhất 1 quyền
        hasPermission = permissions.some(perm => allPermissions.includes(perm));
      }

      if (hasPermission) {
        return next();
      }

      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Bạn không có quyền thực hiện hành động này' 
      });
      
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ 
        error: 'InternalServerError',
        message: error.message 
      });
    }
  };
};

module.exports = checkPermission;
