const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const Reading = require('../models/Reading');


router.get('/dashboard', async (req, res) => {
    try {
        const totalDevices = await Device.countDocuments();
        const activeDevices = await Device.countDocuments({ status: 'on' });


        const devices = await Device.find();
        const currentLoad = devices.reduce((acc, dev) => acc + (dev.status === 'on' ? dev.lastReading : 0), 0);

        res.json({
            totalDevices,
            activeDevices,
            currentLoad
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/predict', async (req, res) => {

    const baseLoad = Math.random() * 1000 + 500;
    res.json({
        predictedLoad: Math.round(baseLoad),
        confidence: '85%',
        message: 'Energy usage expected to peak in 2 hours.'
    });
});

module.exports = router;
