import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../style/register.css';

const Register = ({ onLoginClick }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  const validatePassword = (password) => {
    setHasMinLength(password.length >= 8);
    setHasUpperCase(/[A-Z]/.test(password));
    setHasLowerCase(/[a-z]/.test(password));
    setHasNumber(/\d/.test(password));
    setHasSpecialChar(/[!@#$%^&*()_+[\]{};':"\\|,.<>/?]/.test(password));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!(hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)) {
      setError('Password must meet all requirements.');
      return;
    }

    try {
      const response = await fetch('http://18.228.189.173:8080/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('User registered successfully!');
        setError('');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.message || 'Error registering user.');
      }
    } catch (err) {
      setError('Error connecting to the server. Please try again later.');
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
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="register-input"
              value={password}
              onChange={handlePasswordChange}
            />
            <button type="button" className="toggle-password-button" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <ul className="password-requirements">
            <li className={hasMinLength ? 'valid' : 'invalid'}>At least 8 characters</li>
            <li className={hasUpperCase ? 'valid' : 'invalid'}>One uppercase letter</li>
            <li className={hasLowerCase ? 'valid' : 'invalid'}>One lowercase letter</li>
            <li className={hasNumber ? 'valid' : 'invalid'}>One number</li>
            <li className={hasSpecialChar ? 'valid' : 'invalid'}>One special character (!@#$%^&*)</li>
          </ul>
          <button type="submit" className="register-button">Register</button>
        </form>
        {error && <p className="register-error">{error}</p>}
        {message && <p className="register-success">{message}</p>}
        <p className="back-login"> 
          Return to <button onClick={onLoginClick} className="back-to-login-button">login page</button>
        </p>
      </div>
    </div>
  );
};

export default Register;
