const User = require('../models/user-model');

// Register page
exports.registerPage = (req, res) => {
  res.render('auth/register', { error: null });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('auth/register', { error: 'User with this email or username already exists' });
    }
    
    const user = new User({ username, email, password });
    await user.save();
    
    // Log in the user after registration
    req.session.userId = user._id;
    req.session.username = user.username;
    
    res.redirect('/quotes');
  } catch (error) {
    res.render('auth/register', { error: error.message });
  }
};

// Login page
exports.loginPage = (req, res) => {
  res.render('auth/login', { error: null });
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }
    
    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;
    
    res.redirect('/quotes');
  } catch (error) {
    res.render('auth/login', { error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
};

// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/auth/login');
};

// Middleware to pass user to views
exports.passUserToView = (req, res, next) => {
  res.locals.user = req.session.userId ? {
    _id: req.session.userId,
    username: req.session.username
  } : null;
  next();
};
