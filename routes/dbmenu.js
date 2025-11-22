const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const varosok = await query('SELECT id, nev, megyeid, megyeszekhely, megyeijogu FROM varos LIMIT 200');
    const lelekszam = await query('SELECT varosid, ev, no, osszesen FROM lelekszam LIMIT 200');
    const megyek = await query('SELECT id, nev FROM megye LIMIT 200');
    res.render('dbmenu', { title: 'Adatbázis', varosok, lelekszam, megyek });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hiba a DB lekérés során. Ellenőrizd a DB konfigurációt és a tábla neveket.');
    res.render('dbmenu', { title: 'Adatbázis', varosok: [], lelekszam: [], megyek: [] });
  }
});

module.exports = router;
