const express = require('express');
const crypto = require('crypto');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const userKey = process.env.ENCRYPTION_KEY;


function decryptPassword(encryptedPassword) {
  if (!encryptedPassword) {
    console.error("Senha criptografada não fornecida!");
    throw new Error("A senha criptografada é inválida.");
  }

  const [iv, encrypted] = encryptedPassword.split(':');

  if (!iv || !encrypted) {
    console.error("Formato da senha criptografada inválido:", encryptedPassword);
    throw new Error("O formato da senha criptografada é inválido.");
  }

  const key = Buffer.from(ENCRYPTION_KEY, 'utf8');

  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

router.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
  }

  try {
    const [users] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    const user = users[0];

    if (!user.password) {
      console.error("No password found in the database for user:", email);
      return res.status(500).json({ success: false, message: 'Server error.' });
    }

    const decryptedPassword = decryptPassword(user.password);

    if (decryptedPassword === password) {
      const token = jwt.sign({ id: user.idUsers }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.setHeader('Authorization', `Bearer ${token}`);
      
      res.status(200).json({
        message: 'Login successful!',
        success: true,
        user: { 
          id: user.idUsers, 
          name: user.username, 
          email: user.email,
          token: token 
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;