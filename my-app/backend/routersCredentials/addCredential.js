const express = require('express');
const crypto = require('crypto');
const db = require('../config/db');
const router = express.Router();
require('dotenv').config();

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

function encryptPassword(password) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
  
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
}

router.post('/', async (req, res) => {
  const { user_id, url, username, password } = req.body;

  try {
    const encryptedPassword = encryptPassword(password);

    await db.promise().query(
      'INSERT INTO Credentials (user_id, url, username, password) VALUES (?, ?, ?, ?)',
      [user_id, url, username, encryptedPassword]
    );

    res.status(200).json({ success: true, message: 'Credencial salva com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar credencial:', err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

module.exports = router;
