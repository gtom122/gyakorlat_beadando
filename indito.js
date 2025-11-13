require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;
app.setupAndStart(PORT).catch(err => {
  console.error('Hiba az indításkor:', err);
  process.exit(1);
});
