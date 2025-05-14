const express = require('express');
const router = express.Router();
const { register, login , getUser } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/profile
router.post('/profile', getUser);

module.exports = router;