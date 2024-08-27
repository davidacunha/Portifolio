const express = require('express');
const db = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routers/auth'); 
const updateUser = require('./routers/updateUser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use('/updateUser', updateUser);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
