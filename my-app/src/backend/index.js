const express = require('express');
const app = express();
const PORT = 5000;

// Middleware para parsing JSON
app.use(express.json());

// Rota de autenticação fictícia
app.post('/auth', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos.' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.status(200).json({ success: true, message: 'Login bem-sucedido!' });
  } else {
    res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
