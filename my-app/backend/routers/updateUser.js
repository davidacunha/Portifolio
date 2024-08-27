const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, name } = req.body;

  try {
    await db.promise().query('UPDATE Users SET username = ? WHERE email = ?', [name, email]);

    res.status(200).json({ success: true, message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar usuário no banco de dados:', err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

module.exports = router;
