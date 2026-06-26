const express = require('express');
const bcrypt = require('bcrypt');
const Employee = require('../models/Employee');
const { generateToken, protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, gender, phone, interests, name } = req.body;
    const existing = await Employee.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await Employee.create({
      name: name || `${firstName} ${lastName}`, firstName, lastName, email,
      password: hashed, dateOfBirth, gender, phone, interests: interests || '',
      role: 'user', isActive: true
    });
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Employee.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    user.isActive = true;
    await user.save();
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/logout', protect, async (req, res) => {
  try {
    req.user.isActive = false;
    await req.user.save();
    res.json({ message: 'Logged out' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', protect, (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, firstName: req.user.firstName, lastName: req.user.lastName });
});

module.exports = router;
