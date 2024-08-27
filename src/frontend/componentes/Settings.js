import React, { useState, useEffect } from 'react';
import '../style/Settings.css';

const Settings = ({ userEmail, userName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);

  useEffect(() => {
    setEditName(userName);
    setEditEmail(userEmail);
  }, [userName, userEmail]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const response = await fetch('http://localhost:5000/routers/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editName, email: editEmail }),
    });

    const data = await response.json();

    if (data.success) {
      setIsEditing(false);
    } else {
      alert('Erro ao atualizar os dados do usuário');
    }
  };

  return (
    <div className="settings-container">
      <h2>Configurações do Usuário</h2>
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
          <button onClick={handleSaveClick} className="save-button">Salvar</button>
        ) : (
          <button onClick={handleEditClick} className="edit-button">Editar</button>
        )}
      </div>
    </div>
  );
};

export default Settings;
