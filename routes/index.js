
const express = require('express');
const router = express.Router();
const { saveMessage } = require('../models/messages-model');

// landing page
router.get('/', (req, res) => {
  res.render('index', { title: 'Főoldal' });
});

// contact (GET)
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Kapcsolat' });
});

// contact (POST) - mentés DB-be
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if(!name || !email || !message) {
    req.flash('error', 'Kérlek tölts ki minden mezőt.');
    return res.redirect('/app121/contact'); 
  }
  try {
    await saveMessage(name, email, message);
    req.flash('success', 'Üzeneted elküldve. Köszönjük!');
    res.redirect('/app121/contact'); 
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba történt az üzenet mentésekor.');
    res.redirect('/app121/contact'); 
  }
});

module.exports = router;
