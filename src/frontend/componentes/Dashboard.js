import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Dashboard.css';

const Dashboard = ({onLogout}) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Bem-vindo ao seu Painel de Controle</h1>
        <button className="logout-button" onClick={onLogout}>Sair</button>
      </header>
      <div className="dashboard-buttons">
        <Link to="/Settings" className="dashboard-button">Settings</Link>
        <Link to="/Credentials" className="dashboard-button">My credentials</Link>
      </div>
      <main className="dashboard-content">
        <section>
          <h2>Resumo</h2>
          <p>Aqui você pode ver um resumo das suas atividades.</p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
