import React, { useState } from 'react';
import '../style/Login.css';
import loginIcon from '../images/Logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ onLoginSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://54.207.96.51/middlewares/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('userId', data.user.id);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userKey', data.userKey);
        onLoginSuccess(data.user);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
      <img src={loginIcon} alt="Login Icon" className="login-icon" />
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <p className="register-link">
          Don't have an account <button onClick={onRegisterClick} className="register-button-link">Register</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
