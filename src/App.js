import React, { useState } from 'react';
import Login from './frontend/componentes/Login';
import Register from './frontend/componentes/register';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleLoginClick = () => {
    setIsRegistering(false);
  };

  return (
    <div className="App">
      {isRegistering ? (
        <Register onLoginClick={handleLoginClick} />
      ) : (
        <Login onRegisterClick={handleRegisterClick} />
      )}
    </div>
  );
}

export default App;
