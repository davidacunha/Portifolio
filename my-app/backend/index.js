require('dotenv').config();
const express = require('express');
const db = require('./config/db'); 
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos.' });
  }

  try {
    const [existingUser] = await db.promise().query('SELECT * FROM Users WHERE username = ? OR email = ?', [username, email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Usuário ou e-mail já registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

    res.status(200).json({ success: true, message: 'Usuário criado com sucesso!' });
  } catch (err) {
    console.error('Erro ao registrar usuário no banco de dados:', err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota de autenticação existente
app.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos.' });
  }

  try {
    // Consulta ao banco de dados para verificar o usuário
    const [users] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
    }

    const user = users[0];

    // Compara a senha fornecida com a senha encriptada no banco
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).json({ success: true, message: 'Login bem-sucedido!' });
    } else {
      res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
    }
  } catch (err) {
    console.error('Erro na consulta ao banco de dados:', err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});
