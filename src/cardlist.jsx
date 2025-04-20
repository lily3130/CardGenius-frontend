import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchGet, fetchDelete } from './api';

function CardListPage({ onBack, user, setCardsFromDB }) {
  const [cardList, setCardList] = useState([]);

  const handleDeleteCard = async (card) => {
    try {
      const { user_id } = user;
      const { card: cardName, type } = card;

      await fetchDelete(`/deleteCard?user_id=${user_id}&card=${encodeURIComponent(cardName)}&type=${encodeURIComponent(type)}`);

      setCardList((prev) =>
        prev.filter((c) => !(c.card === cardName && c.type === type))
      );

      alert("✅ Card deleted successfully.");
    } catch (err) {
      console.error('❌ Failed to delete card:', err);
      alert('Failed to delete card.');
    }
  };

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchGet(`/getAllCards?user_id=${user.user_id}`);
        console.log("✅ Raw fetched card data:", data);

        const formatted = data.map((card) => ({
          name: card.card,
          card: card.card,
          type: card.type,
          dateApproved: card.date_approved,
          total: parseFloat(card.accumulate_amount || 0),
          targetAmount: parseFloat(card.target_amount || 0),
        }));

        setCardList(formatted);
        setCardsFromDB(formatted);
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
                {/* 圖片 placeholder 已移除 */}
                <div className="card-details">
                  <div className="card-name">{card.name}</div>
                  <div className="card-meta">Type: {card.type}</div>
                  <div className="card-meta">Historical Spending: ${card.total}</div>
                  {card.type === "reward" && (
                    <div className="card-meta">Reward Target: ${card.targetAmount}</div>
                  )}
                  {card.dateApproved && (
                    <div className="card-meta">Date Approved: {card.dateApproved}</div>
                  )}
                </div>
              </div>
              <button className="delete-button" onClick={() => handleDeleteCard(card)}>
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
