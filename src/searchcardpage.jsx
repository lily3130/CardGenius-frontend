import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchPost, fetchGet } from './api';

function SearchCardPage({ onSearch, setSearchAmount, cards = [], user, setUser }) {
  const [category, setCategory] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [amount, setAmount] = useState('');
  const [rebate, setRebate] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoryTypesMap, setCategoryTypesMap] = useState({});

  useEffect(() => {
    const fetchCardProfiles = async () => {
      try {
        const validCards = cards.filter(card => card.card && card.type);
        const profiles = await Promise.all(validCards.map(async (cardObj) => {
          const url = `/getCardProfile?card=${encodeURIComponent(cardObj.card)}&type=${encodeURIComponent(cardObj.type)}`;
          const res = await fetchGet(url);
          return res || [];
        }));

        const flatProfiles = profiles.flat();
        const categoriesSet = new Set();
        const catMap = {};

        flatProfiles.forEach(profile => {
          const cat = profile.category;
          if (!cat) return;

          categoriesSet.add(cat);

          let rateObj = {};

          if (typeof profile.rate === 'string') {
            try {
              const keyValueRegex = /"([^"]+)":\s*([^,}]+)/g;
              let match;
              while ((match = keyValueRegex.exec(profile.rate)) !== null) {
                const key = match[1];
                let value = match[2].trim();
                if (value.startsWith('"') && value.endsWith('"')) {
                  value = value.slice(1, -1);
                }
                rateObj[key] = value;
              }
            } catch (err) {
              console.warn('Manual parsing failed:', profile.rate);
            }
          } else if (typeof profile.rate === 'object') {
            rateObj = profile.rate;
          }

          const keys = Object.keys(rateObj);
          if (!catMap[cat]) catMap[cat] = new Set();
          keys.forEach(k => catMap[cat].add(k));
        });

        const formattedMap = Object.fromEntries(
          Object.entries(catMap).map(([k, set]) => [k, [...set]])
        );

        setAvailableCategories([...categoriesSet]);
        setCategoryTypesMap(formattedMap);
      } catch (err) {
        console.error("Error fetching profiles", err);
      }
    };

    if (cards.length > 0) fetchCardProfiles();
  }, [cards]);

  const handleSearch = async (e) => {
    e.preventDefault();
  
    if (!user?.user_id || !category || !rebate || selectedTypes.length === 0 || !amount) {
      alert("Please complete all fields: category, rebate, at least one type, and amount.");
      return;
    }
  
    try {
      const requestBody = {
        user_id: user.user_id,
        category,
        type: rebate,
        subgroup: selectedTypes,
        transaction_amount: amount.toString(),
      };
  
      console.log("📤 Sending POST request with:", requestBody);
  
      const result = await fetchPost("/returnRecommendationResult", requestBody);
  
      if (!result || result.length === 0) {
        alert("No recommended cards found.");
        return;
      }
  
      console.log("✅ Received recommendation result:", result);
  
      setSearchAmount(Number(amount));
      onSearch(
        { category, subgroup: selectedTypes, amount, rebate },
        result // <-- result is the array of recommended cards
      );
  
      // ✅ 儲存進 user.transactions（for premium summary 用）
      const newTransaction = { category, rebateType: rebate, amount };
      setUser(prev => ({
        ...prev,
        transactions: [...(prev.transactions || []), newTransaction]
      }));
    } catch (err) {
      console.error("❌ Recommendation API failed", err);
      alert("Something went wrong while searching.");
    }
  };

  const displayedTypes = categoryTypesMap[category] || [];

  return (
    <div className="centered-content">
      <h1 className="welcome-title">Which Card to Use Today</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="category-select">Categories</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSelectedTypes([]);
            }}
          >
            <option value="">Select category</option>
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Transaction Type</label>
          <div className="transaction-type-scroll">
            <div className="transaction-type-grid">
              {displayedTypes.length === 0 && <div style={{ gridColumn: 'span 3' }}>Please select a category</div>}
              {displayedTypes.map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={(e) =>
                      setSelectedTypes(prev =>
                        e.target.checked ? [...prev, type] : prev.filter(t => t !== type)
                      )
                    }
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-row-two-cols">
          <div className="form-group">
            <label htmlFor="amount">Transaction Amount</label>
            <input
              id="amount"
              type="number"
              placeholder="Insert amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="rebate-type">Rebate Type</label>
            <select
              id="rebate-type"
              value={rebate}
              onChange={(e) => setRebate(e.target.value)}
            >
              <option value="">Select rebate</option>
              <option value="cashback">cashback</option>
              <option value="discount">discount</option>
              <option value="mile">mile</option>
              <option value="reward">reward</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="button">Search</button>
        </div>
      </form>
    </div>
  );
}

export default SearchCardPage;
