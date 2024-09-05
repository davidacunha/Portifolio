const express = require('express');
const db = require('../config/db');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/', async (req, res) => {
    const { user_id, url, username, password } = req.body;

    if (!user_id || !url || !username || !password) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.promise().query(
            'INSERT INTO Credentials (user_id, url, username, password) VALUES (?, ?, ?, ?)',
            [user_id, url, username, hashedPassword]
        );

        res.status(200).json({ success: true, message: 'Credencial salva com sucesso!' });
    } catch (err) {
        console.error('Erro ao salvar credencial:', err);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});

module.exports = router;
