/**
 * @swagger
 * /credentials/update:
 *   put:
 *     summary: Atualiza uma credencial existente
 *     tags: 
 *       - Credenciais
 *     description: Atualiza detalhes de uma credencial e criptografa a senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
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
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Credencial atualizada com sucesso.
 *       404:
 *         description: Credencial não encontrada.
 *       500:
 *         description: Erro no servidor.
 */

const express = require('express');
const db = require('../config/db');
const router = express.Router();
const crypto = require('crypto');
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

router.put('/', async (req, res) => {
    const { id, user_id, url, username, password } = req.body;

    try {
        const encryptedPassword = encryptPassword(password);

        const [result] = await db.promise().query(
            'UPDATE Credentials SET url = ?, username = ?, password = ? WHERE id = ? AND user_id = ?',
            [url, username, encryptedPassword, id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Credencial não encontrada' });
        }

        res.status(200).json({ success: true, message: 'Credencial atualizada com sucesso!' });

    } catch (err) {
        console.error('Erro ao atualizar credencial:', err);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});

module.exports = router;
