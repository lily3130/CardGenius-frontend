import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchPost, fetchGet } from './api';

function CreateCardPage({ onBack, onSaveCard, user }) {
  const [showModal, setShowModal] = useState(false);
  const [targetAmount, setTargetAmount] = useState('');
  const [isTargetSet, setIsTargetSet] = useState(null);
  const [bank, setBank] = useState('');
  const [cardName, setCardName] = useState('');
  const [dateApproved, setDateApproved] = useState('');
  const [error, setError] = useState('');
  const [databaseCards, setDatabaseCards] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [cardOptions, setCardOptions] = useState([]);
  const [cardRebateTypeMap, setCardRebateTypeMap] = useState({});
  const [pendingSubmit, setPendingSubmit] = useState(false);

  useEffect(() => {
    const fetchDatabaseCards = async () => {
      try {
        const data = await fetchGet('/getDatabaseCards');
        setDatabaseCards(data);

        const banks = [...new Set(data.map(card => card.bank))];
        setBankOptions(banks);

        const rebateMap = {};
        data.forEach(card => {
          rebateMap[card.card] = { rebateType: card.type };
        });
        setCardRebateTypeMap(rebateMap);
      } catch (err) {
        console.error("Failed to fetch database cards:", err);
      }
    };

    fetchDatabaseCards();
  }, []);

  const handleBankChange = (e) => {
    const selectedBank = e.target.value;
    setBank(selectedBank);
    setCardName('');
    const filteredCards = databaseCards
      .filter(card => card.bank === selectedBank)
      .map(card => card.card);
    setCardOptions(filteredCards);
  };

  const handleCardChange = (e) => {
    const selectedCard = e.target.value;
    setCardName(selectedCard);

    const selectedCardObj = databaseCards.find(card => card.card === selectedCard);
    if (selectedCardObj?.type === 'reward') {
      setIsTargetSet(null);
      setTargetAmount('');
      setShowModal(true);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!bank || !cardName || !dateApproved) {
      setError('Please fill in all fields before submitting.');
      return;
    }

    const rebateInfo = cardRebateTypeMap[cardName];

    if (rebateInfo?.rebateType === 'reward' && isTargetSet === null) {
      setShowModal(true);
      setPendingSubmit(true);
      return;
    }

    try {
      await fetchPost('/addCard', {
        user_id: user.user_id,
        card: cardName,
        type: rebateInfo.rebateType,
        date_approved: dateApproved,
        target_amount: isTargetSet ? parseFloat(targetAmount) : 0
      });

      const formattedCard = {
        name: cardName,
        card: cardName,
        type: rebateInfo.rebateType,
        monthly: 0,
        total: 0,
        minSpend: 0,
        targetAmount: isTargetSet ? parseFloat(targetAmount) : 0,
        bank,
        dateApproved
      };

      onSaveCard(formattedCard);
    } catch (err) {
      console.error("Failed to create card:", err);
      setError("Card creation failed. Please try again.");
    }
  };

  const handleSaveModal = () => {
    if (isTargetSet && (!targetAmount || isNaN(targetAmount))) {
      alert("Please enter a valid target amount.");
      return;
    }

    setShowModal(false);

    if (pendingSubmit) {
      setPendingSubmit(false);
      handleCreate(new Event("submit"));
    }
  };

  return (
    <>
      <div className={`main-content${showModal ? ' blurred' : ''}`}>
        <div className="centered-content">
          <h1 className="create-card-title">Create Card</h1>
          <form id="create-card-form" className="create-card-form" onSubmit={handleCreate}>
            <div className="form-group">
              <label>Bank</label>
              <select value={bank} onChange={handleBankChange}>
                <option value="">Select Bank</option>
                {bankOptions.map(bankName => (
                  <option key={bankName} value={bankName}>{bankName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Card</label>
              <select value={cardName} onChange={handleCardChange} disabled={!bank}>
                <option value="">Select Card</option>
                {cardOptions.map(card => (
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
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="error-message">{error || '\u00A0'}</div>
            <div className="button-group">
              <button type="button" className="button" onClick={onBack}>Back to Search</button>
              <button type="submit" className="button">Create</button>
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
                  type="number"
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
              <button className="button" onClick={handleSaveModal}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateCardPage;
