import React from 'react';
import "./App.css";
import Sidebar from './sidebar'; 

function PageLayout({ children, onCreateCard, onViewCards, onMyAccount, user }) {
  return (
    <div className="page-layout">
      <Sidebar 
        onCreateCard={onCreateCard} 
        onViewCards={onViewCards} 
        onMyAccount={onMyAccount} 
        user={user}
      />
      <div className="page-main">
        {children}
      </div>
    </div>
  );
}

export default PageLayout; 
