const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Wrong password' });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  signup,
  login,
  logout
};
