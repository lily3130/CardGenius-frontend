import React, { useState, useEffect } from 'react';
import './App.css';

function CardListPage({ cards = [], onBack, onDelete, user }) {
    return (
      <div className="centered-content">
        <h1 className="welcome-title">{user.username || 'User'}’s Card</h1>
        <div className="card-list">
          <div className="card-list-scrollable">
            {cards.map((card, index) => (
              <div className="card-item" key={index}>
                <div className="card-info">
                  <div className="card-image-placeholder"></div>
                  <div className="card-details">
                    <div className="card-name">{card.name}</div>
                    <div className="card-meta">This Month Spending: ${card.monthly}</div>
                    <div className="card-meta">Historical Spending: ${card.total}</div>
                    <div className="card-meta">Monthly Minimum Spend: ${card.minSpend}</div>
  
                    {/* 僅當 card 有 targetAmount 時顯示 */}
                    {card.targetAmount > 0 && (
                      <div className="card-meta">Target Amount: ${card.targetAmount}</div>
                    )}
                    {card.dateApproved && (
                      <div className="card-meta">Date Approved: {card.dateApproved}</div>
                    )}
                  
                  </div>
                </div>
  
                <button className="delete-button" onClick={() => onDelete(index)}>🗑 Delete</button>
                <hr />
              </div>
            ))}
          </div>
          <div className="card-list-footer">
            <button className="button" onClick={onBack}>Back to Search</button>
          </div>
        </div>
      </div>
    );
  }

  export default CardListPage;