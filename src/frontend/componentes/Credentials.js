import React, { useState, useEffect } from 'react';
import '../style/Credentials.css';

const Credentials = ({ user }) => {
  const [credentials, setCredentials] = useState([]);
  const [newCredential, setNewCredential] = useState({ url: '', username: '', password: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCredentialId, setCurrentCredentialId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  const loadCredentialsData = () => {
    const storedUserId = sessionStorage.getItem('userId');
    const storedToken = sessionStorage.getItem('token');

    if (storedUserId && storedToken) {
      setUserId(storedUserId);
      setToken(storedToken);
    } else {
      setMessage('Usuário ou token não encontrado.');
    }
  };

  useEffect(() => {
    loadCredentialsData();
  }, []);

  useEffect(() => {
    if (userId && token) {
      fetchCredentials(userId, token);
    }
  }, [userId, token]);

  const fetchCredentials = async (userId, token) => {
    try {
      const response = await fetch('http://localhost:5000/getCredential', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setCredentials(data.credentials);
        setMessage('');
      } else {
        setMessage('Erro ao buscar credenciais.');
      }
    } catch (error) {
      console.error('Erro ao buscar credenciais:', error);
      setMessage('Erro ao conectar ao servidor.');
    }
  };

  const handleAddCredential = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setMessage('Usuário não encontrado.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/addCredential', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newCredential, user_id: userId }),
      });

      const data = await response.json();

      if (data.success) {
        fetchCredentials(userId);
        setNewCredential({ url: '', username: '', password: '' });
        setIsAdding(false);
        setMessage('Credencial adicionada com sucesso!');
      } else {
        setMessage('Erro ao adicionar credencial.');
      }
    } catch (error) {
      console.error('Erro ao adicionar credencial:', error);
      setMessage('Erro ao conectar ao servidor.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCredential({ ...newCredential, [name]: value });
  };

  const handleEditCredential = (id) => {
    const credentialToEdit = credentials.find(cred => cred.id === id);
    setNewCredential({ url: credentialToEdit.url, username: credentialToEdit.username, password: credentialToEdit.password });
    setCurrentCredentialId(id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleUpdateCredential = async () => {
    if (!userId || !currentCredentialId) {
      setMessage('Usuário ou credencial não encontrada.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/updateCredential`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newCredential, id: currentCredentialId, user_id: userId }),
      });

      const data = await response.json();

      if (data.success) {
        fetchCredentials(userId);
        setNewCredential({ url: '', username: '', password: '' });
        setIsEditing(false);
        setIsAdding(false);
        setCurrentCredentialId(null);
        setMessage('Credencial atualizada com sucesso!');
      } else {
        setMessage('Erro ao atualizar credencial.');
      }
    } catch (error) {
      console.error('Erro ao atualizar credencial:', error);
      setMessage('Erro ao conectar ao servidor.');
    }
  };

  const handleDeleteCredential = async (id) => {
    if (!user?.idUsers) {
      setMessage('Usuário não encontrado.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/deleteCredential', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, user_id: user.idUsers }),
      });

      const data = await response.json();

      if (data.success) {
        fetchCredentials();
        setMessage('Credencial excluída com sucesso!');
      } else {
        setMessage('Erro ao excluir credencial.');
      }
    } catch (error) {
      console.error('Erro ao excluir credencial:', error);
      setMessage('Erro ao conectar ao servidor.');
    }
  };

  const PasswordVisibility = (credentialId) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [credentialId]: !prevState[credentialId]
    }));
  };

  return (
    <div className="credentials-container">
      <div className="credentials-content">
        <h2>Manage credentials</h2>
        {message && <p className="message">{message}</p>}
        
        {!isAdding ? (
          <button onClick={() => setIsAdding(true)} className="add-credential-button">Add Credential</button>
        ) : (
          <div className="add-credential-form">
            <input
              type="text"
              name="url"
              placeholder="URL"
              value={newCredential.url}
              onChange={handleInputChange}
              className="credential-input"
            />
            <input
              type="text"
              name="username"
              placeholder="Username ou Email"
              value={newCredential.username}
              onChange={handleInputChange}
              className="credential-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={newCredential.password}
              onChange={handleInputChange}
              className="credential-input"
            />
            {isEditing ? (
              <button onClick={handleUpdateCredential} className="save-credential-button">Atualizar</button>
            ) : (
              <button onClick={handleAddCredential} className="save-credential-button">Salvar</button>
            )}
            <button onClick={() => setIsAdding(false)} className="cancel-credential-button">Cancelar</button>
          </div>
        )}

        {!isAdding && (
          <table className="credentials-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Username/Email</th>
                <th>Senha</th>
                <th>Ações</th>
              </tr>
            </thead>
              <tbody>
              {credentials.map((credential) => (
                <tr key={credential.id}>
                  <td>{credential.url}</td>
                  <td>{credential.username}</td>
                  <td>
                    {showPasswords[credential.id] ? credential.password : '********'}
                  </td>
                  <td>
                    <button onClick={() => PasswordVisibility(credential.id)} className="password-button">
                      {showPasswords[credential.id] ? 'Hide' : 'Unhide'}
                    </button>
                    <button onClick={() => handleEditCredential(credential.id)} className="edit-credential-button">Edit</button>
                    <button onClick={() => handleDeleteCredential(credential.id)} className="delete-credential-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Credentials;
