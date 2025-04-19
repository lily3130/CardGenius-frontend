import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchGet, fetchDelete } from './api';

function CardListPage({ onBack, user, setCardsFromDB }) {
  const [cardList, setCardList] = useState([]);

  const handleDeleteCard = async (cardName) => {
    try {
      await fetchDelete(`/deleteCard?user_id=${user.user_id}&card=${encodeURIComponent(cardName)}`);
      setCardList((prev) => prev.filter((card) => card.name !== cardName));
      alert("✅ Card deleted successfully.");
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

        const formatted = data.map((card) => ({
          name: card.card,
          card: card.card,            // ✅ 必須保留原始 card 字段
          type: card.type,            // ✅ 為了 getCardProfile 用
          dateApproved: card.date_approved,
          total: parseFloat(card.accumulate_amount || 0),
          monthly: 0,
          minSpend: 0,
          targetAmount: 0,
        }));

        setCardList(formatted);
        setCardsFromDB(formatted); // ✅ 更新 App 裡的 cards state
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
                  <div className="card-meta">Type: {card.type}</div> {/* ⬅️ 新增這行 */}
                  <div className="card-meta">This Month Spending: ${card.monthly}</div>
                  <div className="card-meta">Historical Spending: ${card.total}</div>
                  <div className="card-meta">Monthly Minimum Spend: ${card.minSpend}</div>
                  {card.type === "reward" && (
                    <div>🎯 Reward Target: ${card.targetAmount}</div>
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
