const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Staff/Vet
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
