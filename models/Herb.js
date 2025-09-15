const mongoose = require('mongoose');

const HerbSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    sanskritName: { type: String, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String, trim: true },
    pacifies: { type: [String], required: true },
    benefits: { type: [String] }, // <-- ADD THIS
    howToUse: { type: String }    // <-- AND THIS
});

module.exports = mongoose.model('Herb', HerbSchema);