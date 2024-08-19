import React, { useState } from 'react';
import './Login.css';
import loginIcon from './images/Logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleLogin = (e) => {
      e.preventDefault();
  
      if (!email || !password) {
        setError('Por favor, preencha todos os campos.');
        return;
      }
  
        fetch('http://localhost:5000/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert('Login bem-sucedido!');
          } else {
            setError('E-mail ou senha incorretos.');
          }
        })
        .catch((error) => {
          console.error('Erro:', error);
          setError('Ocorreu um erro. Tente novamente.');
        });
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
              placeholder="Senha"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-button">Acessar</button>
          </form>
          {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    );
  };
  
  export default Login;