
const express = require("express");
const router = express.Router();
const { query } = require("../config/db");

// csak admin léphet be
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    req.flash("error", "Nincs jogosultságod az admin oldalhoz.");
    return res.redirect("/app121/"); 
  }
  next();
}

router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await query("SELECT id, name, email, role FROM users ORDER BY role, id");
    res.render("admin", { title: "Admin felület", users });
  } catch (err) {
    console.error(err);
    req.flash("error", "Hiba történt az admin oldal betöltésekor.");
    res.redirect("/app121/"); 
  }
});

module.exports = router;
