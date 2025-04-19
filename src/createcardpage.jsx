import React, { useState } from "react";
import "./App.css";
import { cardRebateType, bankCardOptions } from './constants';
import { fetchPost } from './api';


const API_BASE = "https://17hxyu8crd.execute-api.ap-southeast-1.amazonaws.com";

function CreateCardPage({ onBack, onSaveCard, user }) {
    const [showModal, setShowModal] = useState(false);
    const [targetAmount, setTargetAmount] = useState('');
    const [isTargetSet, setIsTargetSet] = useState(null);
    const [bank, setBank] = useState('');
    const [cardName, setCardName] = useState('');
    const [dateApproved, setDateApproved] = useState('');
    const [error, setError] = useState('');


    const handleCardChange = (e) => {
      const selected = e.target.value;
      setCardName(selected);
  
      const rebateType = cardRebateType[selected];
      if (rebateType?.rebateType === 'reward') {
        setShowModal(true);
      }
    };
  
    const handleCreate = async (e) => {
      e.preventDefault();
      if (!bank || !cardName || !dateApproved) {
        setError('Please fill in all fields before submitting.');
        return;
      }
    
      const rebateInfo = cardRebateType[cardName];
      if (rebateInfo?.rebateType === 'reward' && isTargetSet === null) {
        setShowModal(true);
        return;
      }
      try {
        await fetchPost('/addCard', {
          user_id: user.userId,
          card: cardName,
          type: rebateInfo.rebateType, // cashback / miles / reward / etc.
          date_approved: dateApproved
        });
        alert("Card added successfully!");
        const newCard = {
          name: cardName || 'Card Name',
          monthly: 0,
          total: 0,
          minSpend: 0,
          targetAmount: isTargetSet ? parseFloat(targetAmount) : 0,
          bank,
          dateApproved,
        };
        
        onSaveCard(newCard);
      } catch (err) {
        console.error("Failed to create card:", err);
        setError("Card creation failed. Please try again.");
      }
    };
  
    const handleSaveModal = () => {
      setIsTargetSet(isTargetSet); // 保留 user 選擇
      setTargetAmount(targetAmount); // 保存金額
      setShowModal(false);
    };
  
    return (
      <>
        <div className={`main-content${showModal ? ' blurred' : ''}`}>
          <div className="centered-content">
            <h1 className="create-card-title">Create Card</h1>
            <form className="create-card-form">
              <div className="form-group">
                <label>Bank</label>
                <select value={bank} onChange={(e) => {
                  setBank(e.target.value);
                  setCardName(''); // reset 選擇卡片
                }}>
                  <option value="">Bank Name</option>
                  {Object.keys(bankCardOptions).map(bankName => (
                    <option key={bankName} value={bankName}>{bankName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Card</label>
                <select value={cardName} onChange={handleCardChange}>
                  <option value="">Card Name</option>
                  {bank && bankCardOptions[bank]?.map(card => (
                    <option key={card} value={card}>{card}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date Approved</label>
                <input
                  type="date"
                  value={dateApproved}
                  onChange={(e) => setDateApproved(e.target.value)}
                  max={new Date().toISOString().split("T")[0]} // 限制不能選未來日期
                />
              </div>
              <div className="error-message">
                  {error || '\u00A0'}
                </div>
              <div className="button-group">
                <button type="button" className="button" onClick={onBack}>
                  Back to Search
                </button>
                <button type="submit" className="button" onClick={handleCreate}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
  
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <p className="modal-text">
                This is a Reward Card.<br />
                Want to set a target amount for a reward?
              </p>
              <div className="modal-option">
                <input type="radio" name="reward" onChange={() => setIsTargetSet(true)} />
                <label>
                  Yes. My target amount is:
                  <input
                    type="text"
                    className="modal-input"
                    disabled={!isTargetSet}
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                  />
                </label>
              </div>
              <div className="modal-option">
                <input type="radio" name="reward" onChange={() => setIsTargetSet(false)} />
                <label>No</label>
              </div>
              <div className='button-container'>
                <button className="button" onClick={handleSaveModal}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  
  export default CreateCardPage;