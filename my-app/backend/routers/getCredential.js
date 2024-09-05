const express = require('express');
const db = require('../config/db');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/getCredential', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Autenticação falhou!' });
    }

    const decoded = jwt.verify(token, 'seusecretodechave');
    const userId = req.query.user_id;

    if (decoded.id !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: 'Acesso negado!' });
    }

    const [credentials] = await db.promise().query(
      'SELECT * FROM Credentials WHERE user_id = ?',
      [userId]
    );

    if (credentials.length === 0) {
      return res.status(404).json({ success: false, message: 'Credenciais não encontradas' });
    }

    res.status(200).json({ success: true, credentials });
  } catch (err) {
    console.error('Erro ao buscar credenciais:', err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

module.exports = router;
