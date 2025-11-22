
const express = require('express');
const router = express.Router();
const { listMessages } = require('../models/messages-model');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'Bejelentkezés szükséges.');
  res.redirect('/app121/auth/login'); 
}

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const msgs = await listMessages();
    res.render('messages', { title: 'Üzenetek', messages: msgs });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt az üzenetek lekérésekor.');
    res.redirect('/app121/'); 
  }
});

module.exports = router;
