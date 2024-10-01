router.put('/', async (req, res) => {
    const { id, user_id, url, username, password } = req.body;
  
    try {
      const [result] = await db.promise().query(
        'UPDATE Credentials SET url = ?, username = ?, password = ? WHERE id = ? AND user_id = ?',
        [url, username, password, id, user_id]
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
  