// Sidebar.js
import React from 'react';
import "./App.css";
 
function Sidebar({ onCreateCard, onViewCards, onMyAccount, user }) {
  return (
    <div className="sidebar">
      <div className="avatar-container">
        <div className="avatar-circle"><span className="avatar-icon">👤</span></div>
        <div className="avatar-label">{user?.username || 'Avatar'}</div>
      </div>

      <div className="sidebar-menu">
        <div className="menu-item create-card" onClick={onCreateCard}>
          <span className="icon">➕</span> Create Card
        </div>
        <div className="menu-item your-card" onClick={onViewCards}>
          <span className="icon">📄</span> Your Card
        </div>
        <div className="menu-item premium">
          <span className="icon">👑</span> Premium
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="menu-item my-account" onClick={onMyAccount}>
          <span className="icon">⚙️</span> My account
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
