const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/auth', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos.' });
    }
  
    try {
      const [users] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);
  
      if (users.length === 0) {
        return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
      }
  
      const user = users[0];
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (isMatch) {
        const token = jwt.sign({ id: user.idUsers }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({
          success: true,
          message: 'Login bem-sucedido!',
          user: { id: user.idUsers, name: user.username, email: user.email },
          token
        });
      } else {
        res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
      }
    } catch (err) {
      console.error('Erro na consulta ao banco de dados:', err);
      res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
  });
  

module.exports = router;
