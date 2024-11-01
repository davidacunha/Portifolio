const express = require('express');
const db = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const { swaggerUi, swaggerSpec } = require('./swagger');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const authRoutes = require('./middlewares/auth'); 
const userRoutes = require('./routersUsers');
const credentialRoutes = require('./routersCredentials');

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'https://54.207.96.51/',
  methods: 'GET,POST,DELETE,UPDATE',
  credentials: true
}));

app.options('*', cors());

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/credentials', credentialRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
