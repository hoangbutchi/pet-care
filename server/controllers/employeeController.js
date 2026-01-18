const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const crypto = require('crypto');

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
 * @desc    Lấy danh sách nhân viên
 * @route   GET /api/employees
 * @access  Private (view_employees)
 */
exports.getEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      status = '',
      department = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {
      AND: [],
    };

    // Search filter
    if (search) {
      where.AND.push({
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    // Role filter
    if (role) {
      where.AND.push({
        role: {
          slug: role,
        },
      });
    }

    // Status filter
    if (status !== '') {
      where.AND.push({
        isActive: status === 'active' || status === 'true',
      });
    }

    // Department filter
    if (department) {
      where.AND.push({
        department: { contains: department, mode: 'insensitive' },
      });
    }

    // Get employees
    const [employees, total] = await Promise.all([
      prisma.user.findMany({
        where: where.AND.length > 0 ? where : undefined,
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
        skip,
        take: limitNum,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.user.count({
        where: where.AND.length > 0 ? where : undefined,
      }),
    ]);

    // Remove password from response
    const employeesWithoutPassword = employees.map((emp) => {
      const { password, ...empWithoutPassword } = emp;
      return empWithoutPassword;
    });

    res.json({
      employees: employeesWithoutPassword,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Lấy chi tiết nhân viên
 * @route   GET /api/employees/:id
 * @access  Private (view_employees)
 */
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.user.findUnique({
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

    if (!employee) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }

    const { password, ...employeeWithoutPassword } = employee;

    res.json(employeeWithoutPassword);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Validation schema cho employee
 */
const employeeSchema = Joi.object({
  firstName: Joi.string().min(1).required().messages({
    'string.min': 'Họ không được để trống',
    'any.required': 'Họ không được để trống',
  }),
  lastName: Joi.string().min(1).required().messages({
    'string.min': 'Tên không được để trống',
    'any.required': 'Tên không được để trống',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email không được để trống',
  }),
  username: Joi.string().min(3).required().messages({
    'string.min': 'Username phải có ít nhất 3 ký tự',
    'any.required': 'Username không được để trống',
  }),
  phone: Joi.string().optional(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
      'string.pattern.base': 'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt',
      'any.required': 'Mật khẩu không được để trống',
    }),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
  address: Joi.string().optional(),
  roleId: Joi.string().uuid().required().messages({
    'string.guid': 'Role ID không hợp lệ',
    'any.required': 'Vai trò không được để trống',
  }),
  department: Joi.string().optional(),
  position: Joi.string().optional(),
  salary: Joi.number().optional(),
  hireDate: Joi.date().optional(),
  employeeId: Joi.string().optional(),
  isActive: Joi.boolean().optional().default(true),
});

const updateEmployeeSchema = employeeSchema.fork(['password', 'roleId'], (schema) => schema.optional());

/**
 * @desc    Tạo nhân viên mới
 * @route   POST /api/employees
 * @access  Private (create_employee)
 */
exports.createEmployee = async (req, res) => {
  try {
    // Validate input
    const { error, value: validatedData } = employeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check email unique
    const emailExists = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (emailExists) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    // Check username unique
    if (validatedData.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username: validatedData.username },
      });

      if (usernameExists) {
        return res.status(400).json({ error: 'Username đã tồn tại' });
      }
    }

    // Check employeeId unique
    if (validatedData.employeeId) {
      const employeeIdExists = await prisma.user.findUnique({
        where: { employeeId: validatedData.employeeId },
      });

      if (employeeIdExists) {
        return res.status(400).json({ error: 'Mã nhân viên đã tồn tại' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create employee
    const employee = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    // Log activity
    await logActivity(
      req.user.id,
      'CREATE',
      'employees',
      { employeeId: employee.id, email: employee.email },
      req
    );

    const { password, ...employeeWithoutPassword } = employee;

    res.status(201).json({
      message: 'Tạo nhân viên thành công',
      employee: employeeWithoutPassword,
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Cập nhật nhân viên
 * @route   PUT /api/employees/:id
 * @access  Private (update_employee)
 */
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Check employee exists
    const existingEmployee = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }

    // Validate input
    const { error, value: validatedData } = updateEmployeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check email unique (if changed)
    if (validatedData.email && validatedData.email !== existingEmployee.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return res.status(400).json({ error: 'Email đã tồn tại' });
      }
    }

    // Check username unique (if changed)
    if (validatedData.username && validatedData.username !== existingEmployee.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username: validatedData.username },
      });

      if (usernameExists) {
        return res.status(400).json({ error: 'Username đã tồn tại' });
      }
    }

    // Hash password if provided
    if (validatedData.password) {
      const salt = await bcrypt.genSalt(10);
      validatedData.password = await bcrypt.hash(validatedData.password, salt);
    } else {
      delete validatedData.password;
    }

    // Update employee
    const employee = await prisma.user.update({
      where: { id },
      data: validatedData,
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    // Log activity
    await logActivity(
      req.user.id,
      'UPDATE',
      'employees',
      { employeeId: id, changes: validatedData },
      req
    );

    const { password, ...employeeWithoutPassword } = employee;

    res.json({
      message: 'Cập nhật nhân viên thành công',
      employee: employeeWithoutPassword,
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Xóa nhân viên (soft delete)
 * @route   DELETE /api/employees/:id
 * @access  Private (delete_employee)
 */
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Check employee exists
    const employee = await prisma.user.findUnique({
      where: { id },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }

    // Soft delete - set isActive = false
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    // Log activity
    await logActivity(
      req.user.id,
      'DELETE',
      'employees',
      { employeeId: id, email: employee.email },
      req
    );

    res.json({ message: 'Xóa nhân viên thành công' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Kích hoạt tài khoản
 * @route   PATCH /api/employees/:id/activate
 * @access  Private (update_employee)
 */
exports.activateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.user.update({
      where: { id },
      data: { isActive: true },
      include: { role: true },
    });

    await logActivity(req.user.id, 'UPDATE', 'employees', { employeeId: id, action: 'activate' }, req);

    const { password, ...employeeWithoutPassword } = employee;

    res.json({
      message: 'Kích hoạt tài khoản thành công',
      employee: employeeWithoutPassword,
    });
  } catch (error) {
    console.error('Activate employee error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Vô hiệu hóa tài khoản
 * @route   PATCH /api/employees/:id/deactivate
 * @access  Private (update_employee)
 */
exports.deactivateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      include: { role: true },
    });

    await logActivity(req.user.id, 'UPDATE', 'employees', { employeeId: id, action: 'deactivate' }, req);

    const { password, ...employeeWithoutPassword } = employee;

    res.json({
      message: 'Vô hiệu hóa tài khoản thành công',
      employee: employeeWithoutPassword,
    });
  } catch (error) {
    console.error('Deactivate employee error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Reset mật khẩu
 * @route   POST /api/employees/:id/reset-password
 * @access  Private (update_employee)
 */
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    // Generate temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    await logActivity(req.user.id, 'UPDATE', 'employees', { employeeId: id, action: 'reset_password' }, req);

    res.json({
      message: 'Reset mật khẩu thành công',
      tempPassword, // Trong production, gửi qua email thay vì trả về
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Lấy lịch sử hoạt động của nhân viên
 * @route   GET /api/employees/:id/activity
 * @access  Private (view_employees)
 */
exports.getEmployeeActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: { userId: id },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activityLog.count({
        where: { userId: id },
      }),
    ]);

    res.json({
      activities,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Get employee activity error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Thao tác hàng loạt
 * @route   POST /api/employees/bulk-action
 * @access  Private (update_employee hoặc delete_employee)
 */
exports.bulkAction = async (req, res) => {
  try {
    const { ids, action } = req.body; // action: 'activate' | 'deactivate' | 'delete'

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Danh sách ID không hợp lệ' });
    }

    if (!['activate', 'deactivate', 'delete'].includes(action)) {
      return res.status(400).json({ error: 'Action không hợp lệ' });
    }

    let result;
    switch (action) {
      case 'activate':
        result = await prisma.user.updateMany({
          where: { id: { in: ids } },
          data: { isActive: true },
        });
        break;
      case 'deactivate':
        result = await prisma.user.updateMany({
          where: { id: { in: ids } },
          data: { isActive: false },
        });
        break;
      case 'delete':
        result = await prisma.user.updateMany({
          where: { id: { in: ids } },
          data: { isActive: false },
        });
        break;
    }

    await logActivity(req.user.id, 'BULK_UPDATE', 'employees', { ids, action }, req);

    res.json({
      message: `Thực hiện ${action} thành công cho ${result.count} nhân viên`,
      count: result.count,
    });
  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Export danh sách nhân viên
 * @route   GET /api/employees/export
 * @access  Private (view_employees)
 */
exports.exportEmployees = async (req, res) => {
  try {
    const employees = await prisma.user.findMany({
      include: {
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Remove passwords
    const employeesWithoutPassword = employees.map((emp) => {
      const { password, ...empWithoutPassword } = emp;
      return empWithoutPassword;
    });

    res.json({
      employees: employeesWithoutPassword,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Export employees error:', error);
    res.status(500).json({ error: error.message });
  }
};
