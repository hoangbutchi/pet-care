const express = require('express');
const router = express.Router();
const { createAppointment, getMyAppointments, getAllAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, staffOrAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createAppointment)
    .get(protect, staffOrAdmin, getAllAppointments);

router.route('/my').get(protect, getMyAppointments);
router.route('/:id').put(protect, staffOrAdmin, updateAppointmentStatus);

module.exports = router;
