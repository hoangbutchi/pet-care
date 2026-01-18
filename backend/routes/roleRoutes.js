const express = require('express');
const router = express.Router();
const {
  getRoles,
  getRoleById,
  getRolePermissions,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

// Tất cả routes đều cần authentication
router.use(protect);

// GET /api/roles - Danh sách vai trò
router.get('/', checkPermission('view_roles'), getRoles);

// GET /api/roles/:id - Chi tiết vai trò
router.get('/:id', checkPermission('view_roles'), getRoleById);

// GET /api/roles/:id/permissions - Quyền hạn của vai trò
router.get('/:id/permissions', checkPermission('view_roles'), getRolePermissions);

// POST /api/roles - Tạo vai trò mới
router.post('/', checkPermission('create_role'), createRole);

// PUT /api/roles/:id - Cập nhật vai trò
router.put('/:id', checkPermission('update_role'), updateRole);

// DELETE /api/roles/:id - Xóa vai trò
router.delete('/:id', checkPermission('delete_role'), deleteRole);

module.exports = router;
