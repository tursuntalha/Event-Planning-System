const express = require('express');
const Event = require('../models/Event');
const Employee = require('../models/Employee');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, date, endDate, location, type, tags, maxAttendees } = req.body;
    const event = await Event.create({
      name, description: description || '', date, endDate, location, type,
      tags: tags || [], createdBy: req.user.email, createdById: req.user._id,
      maxAttendees: maxAttendees || 0
    });
    if (req.user.points !== undefined) {
      req.user.points += 15;
      await req.user.save();
    }
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.createdBy !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.createdBy !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    event.isActive = false;
    await event.save();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/:id/rsvp', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const existingRsvp = event.rsvps.find(r => r.email === req.user.email);
    if (existingRsvp) {
      existingRsvp.status = status || 'accepted';
    } else {
      event.rsvps.push({ email: req.user.email, status: status || 'accepted' });
    }
    if (!event.participants.includes(req.user.email)) {
      event.participants.push(req.user.email);
    }
    await event.save();
    if (req.user.points !== undefined) {
      req.user.points += 10;
      await req.user.save();
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/my/created', protect, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.email, isActive: true });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/my/joined', protect, async (req, res) => {
  try {
    const events = await Event.find({ participants: req.user.email, isActive: true });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/suggested/:email', async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.params.email });
    if (!employee) return res.status(404).json({ message: 'User not found' });
    const interests = (employee.interests || '').split(' ').filter(Boolean);
    const suggested = await Event.find({
      isActive: true,
      type: { $in: interests.map(i => new RegExp(i, 'i')) }
    }).limit(10);
    res.json(suggested);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
