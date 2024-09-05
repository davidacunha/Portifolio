import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Header.css';

const Header = ({ onLogout }) => {
  return (
    <div className="dashboard-header">
      <div className="header-buttons">
        <Link to="/Dashboard" className="dashboard-button">Home Page</Link>
        <Link to="/Credentials" className="dashboard-button">My Crendetials</Link>
        <Link to="/Settings" className="dashboard-button">Settings</Link>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
