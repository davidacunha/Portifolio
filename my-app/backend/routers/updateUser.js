const express = require('express');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, name, currentPassword, newPassword } = req.body;

  try {
    const [users] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    const user = users[0];

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Senha atual incorreta' });
      }

      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.promise().query('UPDATE Users SET password = ? WHERE email = ?', [hashedPassword, email]);
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
