import React, { useState, useEffect } from "react";
import "./App.css";
import { cardRebateType, cardTransactionMap } from './constants';

function SearchCardPage({ onCreateCard, onViewCards, onSearch, setSearchAmount, cards = [], user, setUser }) {
  const [category, setCategory] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [amount, setAmount] = useState('');
  const [rebate, setRebate] = useState('');
  const [availableTypes, setAvailableTypes] = useState([]);

  useEffect(() => {
    if (!category) {
      setAvailableTypes([]);
      return;
    }

    const typesSet = new Set();

    cards.forEach((card) => {
      const typesForCategory = cardTransactionMap[card.name]?.[category];
      typesForCategory?.forEach((type) => typesSet.add(type));
    });

    setAvailableTypes(Array.from(typesSet));
  }, [category, cards]);

  const handleSearch = (e) => {
    e.preventDefault();
  
    const searchCriteria = {
      category,
      transactionTypes: selectedTypes,
      amount,
      rebate
    };
  
    // 儲存成一筆 transaction
    const newTransaction = {
      category,
      rebateType: rebate,
      amount
    };

    console.log('💡 Adding transaction:', newTransaction);
    console.log('📦 Current transactions:', [...(user.transactions || []), newTransaction]);
  
    // ✅ 更新 user 的 transactions
    setUser((prev) => ({
      ...prev,
      transactions: [...(prev.transactions || []), newTransaction]
    }));
  
    // 找到符合條件的卡片（模擬）
    const matched = cards.filter(card => {
      const rebateMatch = rebate ? cardRebateType[card.name]?.rebateType === rebate : true;
      const categoryMatch = category ? cardTransactionMap[card.name]?.[category] : true;
      return rebateMatch && categoryMatch;
    }).map((card, index) => ({
      rank: `${index + 1}${['st', 'nd', 'rd'][index] || 'th'} Choice`,
      name: card.name,
      rewardType: cardRebateType[card.name]?.rebateType || 'unknown',
      rewardRate: (Math.random() * 0.05).toFixed(4),
      rewardDetail: `Some benefit for ${category || 'selected category'} - ${rebate || 'selected rebate'}`
    }));
  
    onSearch(searchCriteria, matched);
    setSearchAmount(Number(amount));
  };
  

  return (
    <div className="centered-content">
      <h1 className="welcome-title">Which Card to Use Today</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label>Categories</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select category</option>
            <option value="bill">bill</option>
            <option value="dining">dining</option>
            <option value="entertainment">entertainment</option>
            <option value="grocery">grocery</option>
            <option value="online">online</option>
            <option value="petrol">petrol</option>
            <option value="shopping">shopping</option>
            <option value="travel">travel</option>
          </select>
        </div>

        <div className="form-group">
          <label>Transaction Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f9fafb', padding: '16px' }}>
            {availableTypes.length === 0 && <div style={{ gridColumn: 'span 3' }}>Please select a category</div>}
            {availableTypes.map((type) => (
              <div key={type} className="checkbox-row">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setSelectedTypes(prev =>
                      e.target.checked
                        ? [...prev, type]
                        : prev.filter(t => t !== type)
                    );
                  }}
                />
                <label>{type}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Transaction Amount</label>
          <input
            type="number"
            placeholder="Insert amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Rebate Type</label>
          <select value={rebate} onChange={(e) => setRebate(e.target.value)}>
            <option value="">Select rebate</option>
            <option value="cashback">cashback</option>
            <option value="discount">discount</option>
            <option value="miles">miles</option>
            <option value="reward">reward</option>
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="button">Search</button>
        </div>
      </form>
    </div>
  );
}

export default SearchCardPage;
