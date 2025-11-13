const { query } = require('../config/db');

async function saveMessage(name, email, message) {
  return query('INSERT INTO messages (name,email,message) VALUES (?,?,?)', [name, email, message]);
}

async function listMessages() {
  return query('SELECT * FROM messages ORDER BY created_at DESC');
}

module.exports = {
  saveMessage,
  listMessages
};
