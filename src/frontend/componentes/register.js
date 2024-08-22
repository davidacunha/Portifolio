import React, { useState } from 'react';
import '../style/register.css';

const Register = ({ onLoginClick }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validações simples
    if (!username || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Envia os dados para o backend
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Usuário registrado com sucesso!');
        setError('');
        // Limpa os campos do formulário
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || 'Erro ao registrar o usuário.');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create your account</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="E-mail"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="register-button">Register</button>
        </form>
        {error && <p className="register-error">{error}</p>}
        {message && <p className="register-success">{message}</p>}
        <button onClick={onLoginClick} className="back-to-login-button">Return to login page</button>
      </div>
    </div>
  );
};

export default Register;
