/**
 * @swagger
 * /credentials/delete:
 *   delete:
 *     summary: Deleta uma credencial específica do usuário
 *     tags: 
 *       - Credenciais
 *     description: Exclui a credencial com base no `id` e `user_id` fornecidos.
 *     parameters:
 *       - in: body
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: body
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Credencial deletada com sucesso.
 *       404:
 *         description: Credencial não encontrada.
 *       500:
 *         description: Erro no servidor.
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.delete('/', async (req, res) => {
  const { id, user_id } = req.body;

  if (!id || !user_id) {
    return res.status(400).json({ success: false, message: 'ID ou usuário não fornecido.' });
  }

  try {
    const result = await db.promise().query(
      'DELETE FROM Credentials WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Credencial não encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Credencial deletada com sucesso!' });
  } catch (err) {
    console.error('Erro ao deletar credencial:', err.message);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

module.exports = router;