import React, { useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Login from './frontend/componentes/Login';
import Register from './frontend/componentes/register';
import Dashboard from './frontend/componentes/Dashboard';
import Settings from './frontend/componentes/Settings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const hadleLogout = () => {
    setIsAuthenticated(false);
    navigate('/')
  }

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="App">
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/Dashboard" element={<Dashboard onLogout={hadleLogout} />} />
            <Route path="/Settings" element={<Settings />} />
          </>
        ) : (
          <>
            {isRegistering ? (
              <Route path="/" element={<Register onLoginClick={toggleForm} />} />
            ) : (
              <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} onRegisterClick={toggleForm} />} />
            )}
          </>
        )}
      </Routes>
      {!isAuthenticated && (
        <button className="toggle-button" onClick={toggleForm}>
          {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Registre-se'}
        </button>
      )}
    </div>
  );
}

export default App;
