const express = require('express');
const db = require('./config/db');
const cors = require('cors');
const authRoutes = require('./middlewares/auth'); 
const registerUserRoutes = require('./routersUsers/registerUser');
const updateUser = require('./routersUsers/updateUser');
const addCredentialRoutes = require('./routersCredentials/addCredential');
const getCredentialRoutes = require('./routersCredentials/getCredential');
const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();
app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use('/register', registerUserRoutes);
app.use('/updateUser', updateUser);
app.use('/addCredential', addCredentialRoutes);
app.use('/getCredential', getCredentialRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
