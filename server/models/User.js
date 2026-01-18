const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    peopleId: { type: String }, // CMND/CCCD if needed
    role: {
        type: String,
        enum: ['customer', 'staff', 'admin'],
        default: 'customer'
    },
    phone: String,
    address: String,
    avatar: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
