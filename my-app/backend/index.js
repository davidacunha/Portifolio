require('dotenv').config();
const express = require('express');
const db = require('./config/db'); 
const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

// Middleware para parsing JSON
app.use(express.json());

// Rota de autenticação existente
app.post('/auth', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos.' });
  }

  // Consulta ao banco de dados para verificar o usuário
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Erro na consulta ao banco de dados:', err);
      return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }

    if (results.length > 0) {
      // Usuário encontrado
      res.status(200).json({ success: true, message: 'Login bem-sucedido!' });
    } else {
      // Usuário não encontrado ou senha incorreta
      res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
    }
  });
});

// Nova rota para registro de usuários
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos.' });
  }

  // Verifica se o usuário já existe
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error('Erro ao verificar usuário no banco de dados:', err);
      return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Usuário já registrado com este e-mail.' });
    }

    // Insere o novo usuário no banco de dados
    const insertUserQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertUserQuery, [name, email, password], (err, results) => {
      if (err) {
        console.error('Erro ao registrar usuário no banco de dados:', err);
        return res.status(500).json({ success: false, message: 'Erro no servidor' });
      }

      res.status(200).json({ success: true, message: 'Usuário criado com sucesso!' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

