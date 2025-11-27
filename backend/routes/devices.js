const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const Reading = require('../models/Reading');

router.get('/', async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const device = new Device(req.body);
        await device.save();
        res.status(201).json(device);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (req.body.lastReading && req.body.lastReading > 2000) {
            const Alert = require('../models/Alert');
            const alert = new Alert({
                deviceId: device._id,
                message: `High usage detected: ${device.lastReading}W`,
                type: 'critical'
            });
            await alert.save();
        }

        res.json(device);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/reading', async (req, res) => {
    try {
        const { value } = req.body;
        const reading = new Reading({ deviceId: req.params.id, value });
        await reading.save();

        await Device.findByIdAndUpdate(req.params.id, { lastReading: value, updatedAt: Date.now() });

        res.status(201).json(reading);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/readings', async (req, res) => {
    try {
        const readings = await Reading.find({ deviceId: req.params.id }).sort({ timestamp: -1 }).limit(50);
        res.json(readings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
