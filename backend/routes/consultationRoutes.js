const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { protect } = require('../middleware/authMiddleware');

// Tất cả routes đều cần authentication
router.use(protect);

// Lấy danh sách consultants
router.get('/consultants', consultationController.getConsultants);

// Lấy danh sách available slots
router.get('/available-slots', consultationController.getAvailableSlots);

// Lấy danh sách consultations
router.get('/', consultationController.getConsultations);

// Lấy chi tiết consultation
router.get('/:id', consultationController.getConsultation);

// Tạo consultation mới
router.post('/', consultationController.createConsultation);

// Cập nhật consultation
router.put('/:id', consultationController.updateConsultation);

// Xóa/hủy consultation
router.delete('/:id', consultationController.deleteConsultation);

module.exports = router;
