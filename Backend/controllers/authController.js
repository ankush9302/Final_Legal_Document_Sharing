const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
	console.log('Register function called');
	console.log('Request body:', req.body);
	try {
		const { name, email, password, role, city, phone, address } = req.body;

		// Check if user already exists
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: 'User already exists' });
		}

		// Create new user
		user = new User({
			name,
			email,
			password,
			role,
			city,
			phone,
			address,
			verified: role === 'admin', // Automatically verify admin users
		});

		await user.save();

		// Create and return JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

		res.status(201).json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				city: user.city,
				phone: user.phone,
				address: user.address,
				verified: user.verified
			}
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// Check password
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		// Create and return JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

		res.json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				city: user.city,
				phone: user.phone,
				address: user.address
			}
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server error');
	}
};
