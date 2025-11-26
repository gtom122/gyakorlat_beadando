
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { createUser, findUserByEmail } = require('../models/users-model');

// Register GET
router.get('/register', (req, res) => {
  res.render('register', { title: 'Regisztráció' });
});

// Register POST
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  if(!name || !email || !password || !password2) {
    req.flash('error', 'Minden mezőt ki kell tölteni.');
    return res.redirect('/app121/auth/register');
  }
  if(password !== password2) {
    req.flash('error', 'A jelszavak nem egyeznek.');
    return res.redirect('/app121/auth/register');
  }
  const existing = await findUserByEmail(email);
  if(existing) {
    req.flash('error', 'Már létezik felhasználó ezzel az e-mail címmel.');
    return res.redirect('/app121/auth/register');
  }
  await createUser(name, email, password, 'user');
  req.flash('success', 'Sikeres regisztráció. Jelentkezz be!');
  res.redirect('/app121/auth/login');
});

// Login GET
router.get('/login', (req, res) => {
  res.render('login', { title: 'Bejelentkezés' });
});

// Login POST
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/app121/auth/login',
    failureFlash: 'Hibás email vagy jelszó!'
  }),
  (req, res) => {
    res.redirect('/app121/');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success', 'Sikeres kijelentkezés.');
    res.redirect('/app121/');
  });
});

module.exports = router;
