const express = require('express');
const db = require('../config/db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

function decryptPassword(encryptedPassword) {
  if (!encryptedPassword) {
    return null;
  }

  const parts = encryptedPassword.split(':');
  if (parts.length !== 2) {
    throw new Error('Formato de senha criptografada inválido.');
  }

  const [iv, encrypted] = parts;
  const key = Buffer.from(ENCRYPTION_KEY, 'utf8');
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Autenticação falhou!' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const [credentials] = await db.promise().query(
      'SELECT * FROM Credentials WHERE user_id = ?',
      [userId]
    );

    if (credentials.length === 0) {
      return res.status(404).json({ success: false, message: 'Credenciais não encontradas' });
    }

    const decryptedCredentials = credentials.map(credential => {
      if (!credential.password) {
        return { ...credential, password: null };
      }

      return {
        ...credential,
        password: decryptPassword(credential.password)
      };
    });

    res.status(200).json({ success: true, credentials: decryptedCredentials });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

module.exports = router;
