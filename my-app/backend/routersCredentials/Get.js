/**
 * @swagger
 * /credentials/get:
 *   get:
 *     summary: Retorna as credenciais do usuário
 *     tags:
 *       - Credenciais
 *     description: Busca e descriptografa as credenciais associadas ao `user_id` presente no token de autorização.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer <token>"
 *     responses:
 *       200:
 *         description: Lista de credenciais do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 credentials:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       url:
 *                         type: string
 *                         example: "https://example.com"
 *                       username:
 *                         type: string
 *                         example: "user123"
 *                       password:
 *                         type: string
 *                         example: "decryptedPassword"
 *       401:
 *         description: Falha na autenticação.
 *       500:
 *         description: Erro no servidor.
 */


const express = require('express');
const db = require('../config/db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

function decryptPassword(encryptedPassword) {
    if (!encryptedPassword) {
      return null;
    }

    const parts = encryptedPassword.split(':');
    if (parts.length !== 2) {
      throw new Error('Formato de senha criptografada inválido.');
    }

    const [iv, encrypted] = parts;
    const key = Buffer.from(ENCRYPTION_KEY, 'utf8');
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Autenticação falhou!' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Erro ao verificar o token JWT:', error.message);
      return res.status(401).json({ success: false, message: 'Token inválido!' });
    }

    const userId = decoded.id;

    let credentials;
    try {
      [credentials] = await db.promise().query(
        'SELECT * FROM Credentials WHERE user_id = ?',
        [userId]
      );
    } catch (error) {
      console.error('Erro ao consultar o banco de dados:', error.message);
      return res.status(500).json({ success: false, message: 'Erro no banco de dados' });
    }

    if (credentials.length === 0) {
      return res.status(404).json({ success: false, message: 'Credenciais não encontradas' });
    }

    const decryptedCredentials = credentials.map(credential => {
      try {
        if (!credential.password) {
          return { ...credential, password: null };
        }

        return {
          ...credential,
          password: decryptPassword(credential.password)
        };
      } catch (error) {
        console.error(`Erro ao descriptografar a senha da credencial ${credential.id}:`, error.message);
        return { ...credential, password: null };
      }
    });

    res.status(200).json({ success: true, credentials: decryptedCredentials });
  } catch (err) {
    console.error('Erro no servidor:', err.message);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

module.exports = router;