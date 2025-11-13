const { query } = require('../config/db');
const bcrypt = require('bcrypt');

async function createUser(name, email, password, role='user') {
  const hash = await bcrypt.hash(password, 10);
  return query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', [name, email, hash, role]);
}

async function findUserByEmail(email) {
  const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findUserById(id) {
  const rows = await query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function validatePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  validatePassword
};
