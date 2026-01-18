const express = require('express');
const router = express.Router();
const {
  getPermissions,
  getGroupedPermissions,
  getUserPermissions,
  assignUserPermissions,
  removeUserPermission,
} = require('../controllers/permissionController');
const { protect } = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');

// Tất cả routes đều cần authentication
router.use(protect);

// GET /api/permissions - Danh sách tất cả permissions
router.get('/', checkPermission('view_roles'), getPermissions);

// GET /api/permissions/grouped - Permissions nhóm theo resource
router.get('/grouped', checkPermission('view_roles'), getGroupedPermissions);

// GET /api/users/:id/permissions - Quyền hạn của user cụ thể
router.get('/users/:id/permissions', checkPermission('view_employees'), getUserPermissions);

// POST /api/users/:id/permissions - Gán quyền riêng cho user
router.post('/users/:id/permissions', checkPermission('update_employee'), assignUserPermissions);

// DELETE /api/users/:id/permissions/:permissionId - Xóa quyền của user
router.delete('/users/:id/permissions/:permissionId', checkPermission('update_employee'), removeUserPermission);

module.exports = router;
