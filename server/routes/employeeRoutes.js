const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  activateEmployee,
  deactivateEmployee,
  resetPassword,
  getEmployeeActivity,
  bulkAction,
  exportEmployees,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

// Tất cả routes đều cần authentication
router.use(protect);

// GET /api/employees - Danh sách nhân viên
router.get('/', checkPermission('view_employees'), getEmployees);

// GET /api/employees/export - Export danh sách
router.get('/export', checkPermission('view_employees'), exportEmployees);

// POST /api/employees/bulk-action - Thao tác hàng loạt
router.post('/bulk-action', checkPermission(['update_employee', 'delete_employee'], { requireAll: false }), bulkAction);

// GET /api/employees/:id - Chi tiết nhân viên
router.get('/:id', checkPermission('view_employees'), getEmployeeById);

// POST /api/employees - Tạo nhân viên mới
router.post('/', checkPermission('create_employee'), createEmployee);

// PUT /api/employees/:id - Cập nhật nhân viên
router.put('/:id', checkPermission('update_employee'), updateEmployee);

// DELETE /api/employees/:id - Xóa nhân viên (soft delete)
router.delete('/:id', checkPermission('delete_employee'), deleteEmployee);

// PATCH /api/employees/:id/activate - Kích hoạt tài khoản
router.patch('/:id/activate', checkPermission('update_employee'), activateEmployee);

// PATCH /api/employees/:id/deactivate - Vô hiệu hóa tài khoản
router.patch('/:id/deactivate', checkPermission('update_employee'), deactivateEmployee);

// POST /api/employees/:id/reset-password - Reset mật khẩu
router.post('/:id/reset-password', checkPermission('update_employee'), resetPassword);

// GET /api/employees/:id/activity - Lịch sử hoạt động
router.get('/:id/activity', checkPermission('view_employees'), getEmployeeActivity);

module.exports = router;
