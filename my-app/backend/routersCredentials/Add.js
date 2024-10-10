/**
 * @swagger
 * /credentials/add:
 *   post:
 *     summary: Adiciona uma nova credencial para o usuário
 *     tags: 
 *       - Credenciais
 *     description: Recebe detalhes de uma credencial, criptografa a senha e salva no banco de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               url:
 *                 type: string
 *                 example: "https://example.com"
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Credencial salva com sucesso.
 *       500:
 *         description: Erro ao salvar a credencial.
 */

const express = require('express');
const crypto = require('crypto');
const db = require('../config/db');
const router = express.Router();
require('dotenv').config();

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

function encryptPassword(password) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
  
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
}

router.post('/', async (req, res) => {
  const { user_id, url, username, password } = req.body;

  try {
    const encryptedPassword = encryptPassword(password);

    await db.promise().query(
      'INSERT INTO Credentials (user_id, url, username, password) VALUES (?, ?, ?, ?)',
      [user_id, url, username, encryptedPassword]
    );

    res.status(200).json({ success: true, message: 'Credencial salva com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar credencial:', err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

module.exports = router;
