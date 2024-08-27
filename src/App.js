import React, { useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Login from './frontend/componentes/Login';
import Register from './frontend/componentes/register';
import Dashboard from './frontend/componentes/Dashboard';
import Settings from './frontend/componentes/Settings';
import Header from './frontend/componentes/Header';  // Importar o Header

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUser(user);
    navigate('/Dashboard');
  };

  const hadleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="App">
      {isAuthenticated && <Header onLogout={hadleLogout} />}  {/* Adiciona o Header */}
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Settings" element={<Settings user={user} />} />
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
