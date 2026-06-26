const express = require('express');
const { findBestSlot, generateEventDescription, detectConflict, queryOllama } = require('../services/aiService');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/suggest-slot', async (req, res) => {
  try {
    const { attendees, constraint } = req.body;
    const result = await findBestSlot(attendees || '', constraint || '');
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

router.post('/generate-description', async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await generateEventDescription(prompt || '');
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

router.post('/detect-conflict', protect, async (req, res) => {
  try {
    const { name, date, type } = req.body;
    const existingEvents = await Event.find({ isActive: true, _id: { $ne: req.body.eventId } }).limit(20);
    const result = await detectConflict(name, date, type, existingEvents);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `You are EventAI, a helpful event planning assistant. Answer the following in Turkish:\nUser: ${message}\nAssistant:`;
    const response = await queryOllama(prompt);
    res.json({ response: response || 'Üzgünüm, şu anda yanıt veremiyorum.' });
  } catch (err) {
    res.status(500).json({ response: 'Bir hata oluştu.' });
  }
});

module.exports = router;
