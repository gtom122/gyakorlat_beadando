const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Kapcsolat oldal (GET)
router.get('/', (req, res) => {
  res.render('contact', {
    title: 'Kapcsolat',
    success: null,
    error: null
  });
});

// Kapcsolat üzenet elküldése (POST)
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await db.query(
      "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    res.render('contact', {
      title: 'Kapcsolat',
      success: "Üzeneted elküldve. Köszönjük!",
      error: null
    });

  } catch (err) {
    console.error("Kapcsolat hiba:", err);

    res.render('contact', {
      title: 'Kapcsolat',
      success: null,
      error: "Hiba történt az üzenet elküldése közben."
    });
  }
});

module.exports = router;
