const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    species: { type: String, required: true }, // Cat, Dog, etc.
    breed: String,
    age: Number,
    weight: Number,
    avatar: String,
    imageUrl: String,
    medicalHistory: [{
        date: { type: Date, default: Date.now },
        title: String,
        description: String,
        vet: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
