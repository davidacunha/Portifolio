const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.delete('/delete', async (req, res) => {
  const { id, user_id } = req.body;

  try {
    await db.promise().query(
      'DELETE FROM Credentials WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    res.status(200).json({ success: true, message: 'Credencial excluída com sucesso!' });
  } catch (err) {
    console.error('Erro ao excluir credencial:', err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

module.exports = router;
