import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../style/Settings.css';

const Settings = ({ userEmail, username }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(username);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordValidations, setPasswordValidations] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setEditName(username);
    setEditEmail(userEmail);
  }, [username, userEmail]);

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]/.test(password);
    setPasswordValidations({ hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleSaveClick = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users/Update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: editName, 
          email: editEmail, 
          currentPassword, 
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditing(false);
        setMessage('User updated successfully!');
      } else {
        setMessage(data.message || 'Error updating user information.');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      setMessage('Error updating user information.');
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setMessage('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <h2>User Settings</h2>
        {message && <p className="message">{message}</p>}
        <div>
          <label>
            Name:<input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={!isEditing}
            />
          </label>
          <label>
            Email:<input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              disabled={!isEditing}
            />
          </label>
          {isEditing && (
            <>
              <label>
                Current Password:<div className="password-input-wrapper">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                  />
                  <button type="button" className="toggle-password-button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
              <label>
                New Password:<div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    placeholder="Enter new password"
                  />
                  <button type="button" className="toggle-password-button" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
              <ul className="change-password">
                <li className={passwordValidations.hasMinLength ? 'valid' : 'invalid'}>At least 8 characters</li>
                <li className={passwordValidations.hasUpperCase ? 'valid' : 'invalid'}>One uppercase letter</li>
                <li className={passwordValidations.hasLowerCase ? 'valid' : 'invalid'}>One lowercase letter</li>
                <li className={passwordValidations.hasNumber ? 'valid' : 'invalid'}>One number</li>
                <li className={passwordValidations.hasSpecialChar ? 'valid' : 'invalid'}>One special character (!@#$%^&*)</li>
              </ul>
              <label>
                Confirm your new password:<div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button type="button" className="toggle-password-button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>
            </>
          )}
          {isEditing ? (
            <div className="button-group">
              <button onClick={handleSaveClick} className="save-button">Save</button>
              <button onClick={handleCancelClick} className="cancel-button">Cancel</button>
            </div>
          ) : (
            <button onClick={handleEditClick} className="edit-button">Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
