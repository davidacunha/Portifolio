/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags:
 *       - Usuários
 *     description: Recebe os detalhes do usuário, criptografa a senha e armazena no banco de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso.
 *       400:
 *         description: E-mail já registrado ou campos obrigatórios não preenchidos.
 *       500:
 *         description: Erro ao registrar o usuário.
 */

const express = require('express');
const db = require('../config/db');
const crypto = require('crypto');
const router = express.Router();

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16; 

function encryptPassword(password) {
  if (!password) {
    throw new Error("A senha não pode ser indefinida ou vazia.");
  }

  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("A chave de criptografia (ENCRYPTION_KEY) deve ter 32 caracteres.");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Por favor, preencha todos os campos.' });
  }

  try {
    const [existingUser] = await db.promise().query(
      'SELECT * FROM Users WHERE email = ?', [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'E-mail já registrado. Por favor, utilize outro e-mail ou faça login.'
      });
    }

    const encryptedPassword = encryptPassword(password);

    await db.promise().query(
      'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
      [username, email, encryptedPassword]
    );

    res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao registrar usuário:', err);
    res.status(500).json({ success: false, message: 'Erro ao registrar usuário' });
  }
});

module.exports = router;
