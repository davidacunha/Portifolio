import React, { useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import Login from './frontend/componentes/Login';
import Register from './frontend/componentes/Register';
import Dashboard from './frontend/componentes/Dashboard';
import Credentials from './frontend/componentes/Credentials';
import Settings from './frontend/componentes/Settings';
import Header from './frontend/componentes/Header';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    sessionStorage.setItem('token', (userData.token));
    sessionStorage.setItem('user', JSON.stringify(userData));
    navigate('/Dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="App">
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Settings" element={<Settings userEmail={user?.email} username={user?.name} />} />
            <Route path="/Credentials" element={<Credentials user={user} />} />
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
    </div>
  );
}

export default App;
