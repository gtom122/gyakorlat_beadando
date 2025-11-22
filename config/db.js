// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();
let pool;

async function initDb() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  await ensureTables();
  console.log('DB pool initialized');
}

async function query(sql, params) {
  if (!pool) throw new Error('DB pool not initialized');
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function ensureTables() {
  // Users (regisztráltak + admin)
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(200) UNIQUE,
      password VARCHAR(200),
      role ENUM('user','admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Üzenetek (Kapcsolat űrlap)
  await query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200),
      email VARCHAR(200),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function ensureAdminExists() {
  const bcrypt = require('bcrypt');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  const users = await query('SELECT * FROM users WHERE email = ?', [adminEmail]);

  if (users.length === 0) {
    const hash = await bcrypt.hash(adminPass, 10);
    await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin', adminEmail, hash, 'admin']
    );
    console.log('Admin account created:', adminEmail);
  } else {
    console.log('Admin account exists');
  }
}

module.exports = {
  initDb,
  query,
  ensureAdminExists,
  getPool: () => pool
};
