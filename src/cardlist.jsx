import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchGet, fetchDelete } from './api';

function CardListPage({ onBack, user }) {
  const [cardList, setCardList] = useState([]);

  const handleDeleteCard = async (cardName) => {
    try {
      await fetchDelete(`/delete_card?user_id=${user.user_id}&card=${encodeURIComponent(cardName)}`);
      setCardList((prev) => prev.filter((card) => card.name !== cardName));
    } catch (err) {
      console.error('Failed to delete card:', err);
      alert('Failed to delete card.');
    }
  };

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchGet(`/getAllCards?user_id=${user.user_id}`);
        console.log("✅ Raw fetched card data:", data); 
        setCardList(
          data.map((card) => ({
            name: card.card,
            type: card.type,
            dateApproved: card.date_approved,
            total: parseFloat(card.accumulate_amount || 0),
            monthly: 0,
            minSpend: 0,
            targetAmount: 0,
          }))
        );
      } catch (err) {
        console.error('Failed to load user cards:', err);
      }
    };

    if (user.user_id) {
      console.log("👤 Current user_id:", user.user_id);
      loadCards();
    }
  }, [user.user_id]);

  return (
    <div className="centered-content">
      <h1 className="welcome-title">{user.username || 'User'}’s Cards</h1>
      <div className="card-list">
        <div className="card-list-scrollable">
          {cardList.map((card, index) => (
            <div className="card-item" key={index}>
              <div className="card-info">
                <div className="card-image-placeholder"></div>
                <div className="card-details">
                  <div className="card-name">{card.name}</div>
                  <div className="card-meta">This Month Spending: ${card.monthly}</div>
                  <div className="card-meta">Historical Spending: ${card.total}</div>
                  <div className="card-meta">Monthly Minimum Spend: ${card.minSpend}</div>
                  {card.targetAmount > 0 && (
                    <div className="card-meta">Target Amount: ${card.targetAmount}</div>
                  )}
                  {card.dateApproved && (
                    <div className="card-meta">Date Approved: {card.dateApproved}</div>
                  )}
                </div>
              </div>
              <button className="delete-button" onClick={() => handleDeleteCard(card.name)}>
                🗑 Delete
              </button>
              <hr />
            </div>
          ))}
        </div>
        <div className="card-list-footer">
          <button className="button" onClick={onBack}>
            Back to Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardListPage;
