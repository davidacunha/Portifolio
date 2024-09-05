const express = require('express');
const db = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routers/auth'); 
const registerUserRoutes = require('./routers/registerUser');
const updateUser = require('./routers/updateUser');
const addCredentialRoutes = require('./routers/addCredential');
const getCredentialRoutes = require('./routers/getCredential');

const app = express();
const PORT = process.env.PORT || 5000;

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
