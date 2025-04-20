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
  const [cardType, setCardType] = useState('');

  useEffect(() => {
    const fetchDatabaseCards = async () => {
      try {
        const data = await fetchGet('/getDatabaseCards');
        console.log("📦 fetched card data:", data);
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

  const handleCardChange = async (e) => {
    const selectedCard = e.target.value;
    setCardName(selectedCard);
  
    const selectedCardObj = databaseCards.find(
      card => card.card.trim().toLowerCase() === selectedCard.trim().toLowerCase()
    );
  
    if (!selectedCardObj) {
      console.warn("❗ 無法找到卡片對應的 databaseCard:", selectedCard);
      setCardType('unknown');
      return;
    }
  
    console.log("🌐 selectedCardObj GET:", selectedCardObj);
  
    // 🔧 type is now array, e.g., ["mile", "reward"]
    const typeList = selectedCardObj.type || [];
    const hasReward = Array.isArray(typeList) && typeList.includes("reward");
  
    // ✅ 這裡根據是否包含 reward，設定 type 和顯示 modal
    if (hasReward) {
      setCardType("reward");
      setIsTargetSet(null);
      setTargetAmount('');
      setShowModal(true);
    } else {
      // 如果是單一類型（非 reward），就選第一個作為 type
      const firstType = Array.isArray(typeList) && typeList.length > 0 ? typeList[0] : 'unknown';
      setCardType(firstType);
    }
  };
  
  
  

  console.log("🧾 cardType before submit:", cardType);

  const handleCreate = async (e) => {
    e.preventDefault();
  
    if (!bank || !cardName || !dateApproved) {
      setError('Please fill in all fields before submitting.');
      return;
    }
  
    if (cardType === 'reward' && isTargetSet === null) {
      setShowModal(true);
      setPendingSubmit(true);
      return;
    }
  
    const payload = {
      user_id: String(user.user_id),
      card: String(cardName),
      date_approved: String(dateApproved),
      target_amount: String(
        cardType === 'reward'
          ? (isTargetSet ? String(parseInt(targetAmount || '0', 10)) : '0')
          : '0.00'
      )
    };
  
    console.log('📦 payload to submit (no type):', payload);
  
    try {
      await fetchPost('/addCard', payload);
  
      const formattedCard = {
        name: cardName,
        card: cardName,
        type: cardType,  // 前端還是可以記錄
        monthly: 0,
        total: 0,
        minSpend: 0,
        targetAmount: payload.target_amount,
        bank,
        dateApproved
      };
  
      onSaveCard(formattedCard);
    } catch (err) {
      console.error("❌ Failed to create card:", err);
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
  
      // ✅ 延遲一點點讓 modal 關掉
      setTimeout(() => {
        document.getElementById("create-card-form").dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }, 100); // optional: small delay
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
              <input
                type="radio"
                name="reward"
                checked={isTargetSet === true}
                onChange={() => setIsTargetSet(true)}
              />
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
              <input
                type="radio"
                name="reward"
                checked={isTargetSet === false}
                onChange={() => setIsTargetSet(false)}
              />
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