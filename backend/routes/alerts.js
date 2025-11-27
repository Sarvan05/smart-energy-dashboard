const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// Get all alerts
router.get('/', async (req, res) => {
    try {
        const alerts = await Alert.find().populate('deviceId', 'name').sort({ timestamp: -1 }).limit(10);
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
