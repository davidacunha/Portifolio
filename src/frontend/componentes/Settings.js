import React, { useState, useEffect } from 'react';
import '../style/Settings.css';

const Settings = ({ userEmail, username }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(username);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setEditName(username);
    setEditEmail(userEmail);
  }, [username, userEmail]);

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch('http://localhost:5000/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditing(false);
        setMessage('Usuário atualizado com sucesso!');
      } else {
        setMessage('Erro ao atualizar os dados do usuário');
      }
    } catch (error) {
      console.error('Erro ao atualizar os dados do usuário:', error);
      setMessage('Erro ao atualizar os dados do usuário');
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="settings-container">
      <div className="settings-content"> {/* Adicionei este container para o fundo cinza */}
        <h2>Configurações do Usuário</h2>
        {message && <p className="message">{message}</p>}
        <div>
          <label>
            Nome:<input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={!isEditing}
            />
          </label>
          <label>
            Email:<input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              disabled={!isEditing}
            />
          </label>
          {isEditing ? (
            <div className="button-group">
              <button onClick={handleSaveClick} className="save-button">Salvar</button>
              <button onClick={handleCancelClick} className="cancel-button">Cancelar</button>
            </div>
          ) : (
            <button onClick={handleEditClick} className="edit-button">Editar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
