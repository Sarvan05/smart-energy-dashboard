const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['warning', 'critical'], default: 'warning' },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Alert', AlertSchema);
