const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { protect } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authentication
router.use(protect);

// Lấy danh sách campaigns
router.get('/campaigns', emailController.getCampaigns);

// Lấy danh sách recipients
router.get('/recipients', emailController.getRecipients);

// Lấy chi tiết campaign
router.get('/campaigns/:id', emailController.getCampaign);

// Tạo campaign mới
router.post('/campaigns', emailController.createCampaign);

// Cập nhật campaign
router.put('/campaigns/:id', emailController.updateCampaign);

// Xóa campaign
router.delete('/campaigns/:id', emailController.deleteCampaign);

// Gửi campaign
router.post('/campaigns/:id/send', emailController.sendCampaign);

module.exports = router;
