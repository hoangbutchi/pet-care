const prisma = require('../prismaClient');

/**
 * @desc    Lấy danh sách tất cả permissions
 * @route   GET /api/permissions
 * @access  Private (view_roles)
 */
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: [
        { resource: 'asc' },
        { action: 'asc' },
      ],
    });

    res.json({ permissions });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Lấy permissions nhóm theo resource
 * @route   GET /api/permissions/grouped
 * @access  Private (view_roles)
 */
exports.getGroupedPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: [
        { resource: 'asc' },
        { action: 'asc' },
      ],
    });

    // Group by resource
    const grouped = permissions.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    }, {});

    res.json({ grouped });
  } catch (error) {
    console.error('Get grouped permissions error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Lấy quyền hạn của user cụ thể
 * @route   GET /api/users/:id/permissions
 * @access  Private (view_employees)
 */
exports.getUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }

    // Combine role permissions and user-specific permissions
    const rolePermissions = user.role ? user.role.permissions : [];
    const userPermissions = user.permissions.map((up) => up.permission);

    res.json({
      rolePermissions,
      userPermissions,
      allPermissions: [...rolePermissions, ...userPermissions],
    });
  } catch (error) {
    console.error('Get user permissions error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Gán quyền riêng cho user
 * @route   POST /api/users/:id/permissions
 * @access  Private (update_employee)
 */
exports.assignUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;

    if (!Array.isArray(permissionIds)) {
      return res.status(400).json({ error: 'permissionIds phải là mảng' });
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy user' });
    }

    // Update user permissions
    await prisma.userPermission.deleteMany({
      where: { userId: id },
    });

    if (permissionIds.length > 0) {
      await prisma.userPermission.createMany({
        data: permissionIds.map((permissionId) => ({
          userId: id,
          permissionId,
        })),
        skipDuplicates: true,
      });
    }

    // Get updated user with permissions
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    res.json({
      message: 'Gán quyền thành công',
      permissions: updatedUser.permissions.map((up) => up.permission),
    });
  } catch (error) {
    console.error('Assign user permissions error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Xóa quyền của user
 * @route   DELETE /api/users/:id/permissions/:permissionId
 * @access  Private (update_employee)
 */
exports.removeUserPermission = async (req, res) => {
  try {
    const { id, permissionId } = req.params;

    await prisma.userPermission.deleteMany({
      where: {
        userId: id,
        permissionId,
      },
    });

    res.json({ message: 'Xóa quyền thành công' });
  } catch (error) {
    console.error('Remove user permission error:', error);
    res.status(500).json({ error: error.message });
  }
};
