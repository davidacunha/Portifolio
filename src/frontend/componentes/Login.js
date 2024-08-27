import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';
import loginIcon from '../images/Logo.png';

const Login = ({ onLoginSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={loginIcon} alt="Login Icon" className="login-icon" />
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <p className="register-link">
        Don't have an account? <button onClick={onRegisterClick} className="link-button">Register</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
