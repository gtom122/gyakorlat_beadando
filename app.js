// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const { initDb, ensureAdminExists } = require('./config/db');

const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layout');

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'titok',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// passport config (local)
const LocalStrategy = require('passport-local').Strategy;
const { findUserByEmail, validatePassword } = require('./models/users-model');

passport.use(new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await findUserByEmail(email);
      if (!user) return done(null, false, { message: 'Helytelen e-mail vagy jelszó' });
      const ok = await validatePassword(password, user.password);
      if (!ok) return done(null, false, { message: 'Helytelen e-mail vagy jelszó' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const { findUserById } = require('./models/users-model');
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// locals middleware (view-ben elérhető)
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/dbmenu', require('./routes/dbmenu'));
app.use('/messages', require('./routes/messages'));
app.use('/cities', require('./routes/cities'));
app.use('/admin', require('./routes/admin'));

async function setupAndStart(port) {
  // init DB connection pool etc.
  await initDb();
  // ensure users/messages tables and admin exist
  await ensureAdminExists();

  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
      resolve();
    });
  });
}

module.exports = {
  app,
  setupAndStart
};
