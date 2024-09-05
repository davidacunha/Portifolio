import React, { useState, useEffect } from 'react';
import '../style/Credentials.css';

const Credentials = ({ user }) => {
  const [credentials, setCredentials] = useState([]);
  const [newCredential, setNewCredential] = useState({ url: '', username: '', password: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      fetchCredentials(userId);
    } else {
      setMessage('Usuário não encontrado.');
      console.log('Usuário não encontrado: ', user);
    }
  }, []);
  
  const fetchCredentials = async (userId) => {
    if (!userId) { 
      setMessage('Usuário não encontrado.');
      console.log('Erro: usuário sem ID');
      return;
    }
  
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/getCredential?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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
      console.log('Erro: usuário sem ID');
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
  
      if (!response.ok) {
        throw new Error('Erro na resposta do servidor');
      }
  
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

  const handleDeleteCredential = async (id) => {
    if (!user?.idUsers) {
      setMessage('Usuário não encontrado.');
      console.log('Erro: usuário sem ID');
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

      if (!response.ok) {
        throw new Error('Erro na resposta do servidor');
      }

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

  return (
    <div className="credentials-container">
      <div className="credentials-content">
        <h2>Gerenciar Credenciais</h2>
        {message && <p className="message">{message}</p>}
        {!isAdding ? (
          <button onClick={() => setIsAdding(true)} className="add-credential-button">Adicionar Credencial</button>
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
            <button onClick={handleAddCredential} className="save-credential-button">Salvar</button>
            <button onClick={() => setIsAdding(false)} className="cancel-credential-button">Cancelar</button>
          </div>
        )}

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
                <td>{credential.password}</td>
                <td>
                  <button onClick={() => handleDeleteCredential(credential.id)} className="delete-credential-button">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Credentials;
