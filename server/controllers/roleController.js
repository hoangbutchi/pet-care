const prisma = require('../prismaClient');
const Joi = require('joi');

/**
 * Helper function để log activity
 */
const logActivity = async (userId, action, resource, details, req) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        resource,
        details,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
      },
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

/**
 * @desc    Lấy danh sách vai trò
 * @route   GET /api/roles
 * @access  Private (view_roles)
 */
exports.getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const rolesWithCounts = roles.map((role) => ({
      ...role,
      userCount: role._count.users,
      permissionCount: role.permissions.length,
    }));

    res.json({ roles: rolesWithCounts });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Lấy chi tiết vai trò
 * @route   GET /api/roles/:id
 * @access  Private (view_roles)
 */
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      return res.status(404).json({ error: 'Không tìm thấy vai trò' });
    }

    res.json(role);
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Lấy quyền hạn của vai trò
 * @route   GET /api/roles/:id/permissions
 * @access  Private (view_roles)
 */
exports.getRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    });

    if (!role) {
      return res.status(404).json({ error: 'Không tìm thấy vai trò' });
    }

    res.json({ permissions: role.permissions });
  } catch (error) {
    console.error('Get role permissions error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Validation schema cho role
 */
const roleSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    'string.min': 'Tên vai trò không được để trống',
    'any.required': 'Tên vai trò không được để trống',
  }),
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Mã vai trò chỉ được chứa chữ thường, số và dấu gạch ngang',
      'any.required': 'Mã vai trò không được để trống',
    }),
  description: Joi.string().optional(),
  permissionIds: Joi.array().items(Joi.string().uuid()).optional(),
});

/**
 * @desc    Tạo vai trò mới
 * @route   POST /api/roles
 * @access  Private (create_role)
 */
exports.createRole = async (req, res) => {
  try {
    // Validate input
    const { error, value: validatedData } = roleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check name unique
    const nameExists = await prisma.role.findUnique({
      where: { name: validatedData.name },
    });

    if (nameExists) {
      return res.status(400).json({ error: 'Tên vai trò đã tồn tại' });
    }

    // Check slug unique
    const slugExists = await prisma.role.findUnique({
      where: { slug: validatedData.slug },
    });

    if (slugExists) {
      return res.status(400).json({ error: 'Mã vai trò đã tồn tại' });
    }

    // Extract permissionIds
    const { permissionIds, ...roleData } = validatedData;

    // Create role
    const role = await prisma.role.create({
      data: {
        ...roleData,
        permissions: permissionIds
          ? {
              connect: permissionIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        permissions: true,
      },
    });

    // Log activity
    await logActivity(req.user.id, 'CREATE', 'roles', { roleId: role.id, name: role.name }, req);

    res.status(201).json({
      message: 'Tạo vai trò thành công',
      role,
    });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Cập nhật vai trò
 * @route   PUT /api/roles/:id
 * @access  Private (update_role)
 */
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Check role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return res.status(404).json({ error: 'Không tìm thấy vai trò' });
    }

    // Không cho update system roles
    if (existingRole.isSystem) {
      return res.status(403).json({ error: 'Không thể chỉnh sửa vai trò hệ thống' });
    }

    // Validate input
    const { error, value: validatedData } = roleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check name unique (if changed)
    if (validatedData.name && validatedData.name !== existingRole.name) {
      const nameExists = await prisma.role.findUnique({
        where: { name: validatedData.name },
      });

      if (nameExists) {
        return res.status(400).json({ error: 'Tên vai trò đã tồn tại' });
      }
    }

    // Check slug unique (if changed)
    if (validatedData.slug && validatedData.slug !== existingRole.slug) {
      const slugExists = await prisma.role.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return res.status(400).json({ error: 'Mã vai trò đã tồn tại' });
      }
    }

    // Extract permissionIds
    const { permissionIds, ...roleData } = validatedData;

    // Update role
    const role = await prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        permissions: permissionIds
          ? {
              set: permissionIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        permissions: true,
      },
    });

    // Log activity
    await logActivity(req.user.id, 'UPDATE', 'roles', { roleId: id, changes: validatedData }, req);

    res.json({
      message: 'Cập nhật vai trò thành công',
      role,
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Xóa vai trò
 * @route   DELETE /api/roles/:id
 * @access  Private (delete_role)
 */
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Check role exists
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      return res.status(404).json({ error: 'Không tìm thấy vai trò' });
    }

    // Không cho xóa system roles
    if (role.isSystem) {
      return res.status(403).json({ error: 'Không thể xóa vai trò hệ thống' });
    }

    // Không cho xóa role đang có user
    if (role._count.users > 0) {
      return res.status(400).json({ 
        error: `Không thể xóa vai trò đang có ${role._count.users} nhân viên` 
      });
    }

    // Delete role
    await prisma.role.delete({
      where: { id },
    });

    // Log activity
    await logActivity(req.user.id, 'DELETE', 'roles', { roleId: id, name: role.name }, req);

    res.json({ message: 'Xóa vai trò thành công' });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ error: error.message });
  }
};
