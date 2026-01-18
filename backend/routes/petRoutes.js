const express = require('express');
const { getMyPets, addPet, addHealthRecord, getPetById } = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
    .get(protect, getMyPets)
    .post(protect, upload.single('image'), addPet);
router.route('/:id').get(protect, getPetById);
router.route('/:id/health').post(protect, addHealthRecord);

module.exports = router;
