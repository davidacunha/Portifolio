const express = require('express');
const crypto = require('crypto');
const db = require('../config/db');
const router = express.Router();

function encryptPassword(password) {
  const cipher = crypto.createCipher('aes-256-ctr', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptPassword(encryptedPassword) {
  const decipher = crypto.createDecipher('aes-256-ctr', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

router.post('/', async (req, res) => {
  const { email, name, currentPassword, newPassword } = req.body;

  try {
    const [users] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    const user = users[0];

    if (currentPassword) {
      const decryptedPassword = decryptPassword(user.password);
      if (currentPassword !== decryptedPassword) {
        return res.status(401).json({ success: false, message: 'Senha atual incorreta' });
      }

      if (newPassword) {
        const encryptedNewPassword = encryptPassword(newPassword);
        await db.promise().query('UPDATE Users SET password = ? WHERE email = ?', [encryptedNewPassword, email]);
      }
    }

    if (name) {
      await db.promise().query('UPDATE Users SET username = ? WHERE email = ?', [name, email]);
    }

    res.status(200).json({ success: true, message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar usuário no banco de dados:', err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

module.exports = router;