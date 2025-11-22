
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Lista
router.get("/", async (req, res) => {
  const cities = await db.query("SELECT * FROM varos");
  res.render("cities/list", { title: "Városok", cities });
});

// Új hozzáadása (űrlap)
router.get("/new", (req, res) => {
  res.render("cities/new", { title: "Új város" });
});

// Új mentése
router.post("/new", async (req, res) => {
  const { nev, megyeid, megyeszekhely, megyeijogu } = req.body;
  await db.query(
    "INSERT INTO varos (nev, megyeid, megyeszekhely, megyeijogu) VALUES (?,?,?,?)",
    [nev, megyeid, megyeszekhely, megyeijogu]
  );
  res.redirect("/app121/cities"); 
});

// Szerkesztés űrlap
router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const [city] = await db.query("SELECT * FROM varos WHERE id = ?", [id]);
  res.render("cities/edit", { title: "Város szerkesztése", city });
});

// Módosítás mentése
router.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { nev, megyeid, megyeszekhely, megyeijogu } = req.body;
  await db.query(
    "UPDATE varos SET nev=?, megyeid=?, megyeszekhely=?, megyeijogu=? WHERE id=?",
    [nev, megyeid, megyeszekhely, megyeijogu, id]
  );
  res.redirect("/app121/cities"); 
});

// Törlés
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await db.query("DELETE FROM varos WHERE id = ?", [id]);
  res.redirect("/app121/cities"); 
});

module.exports = router;
