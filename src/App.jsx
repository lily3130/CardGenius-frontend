import React, { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./loginpage";
import RegisterPage from "./registerpage";
import CreateCardPageLayout from "./createcardpagelayout";
import CardListPage from "./cardlist";
import SearchCardPage from './searchcardpage';
import PageLayout from './pagelayout';
import SearchResultsPage from './searchresultspage';
import MyAccountPage from './myaccountpage';
import SignInPage from "./signinpage";
import { fetchPatch, fetchGet } from './api';

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [user, setUser] = useState({
    username: "Avatar",
    password: "*******",
    isPremium: false,
    transactions: []
  });
  const [cards, setCards] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchAmount, setSearchAmount] = useState('');
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [searchRebateType, setSearchRebateType] = useState('');

  const handleLoginSuccess = async (loginData) => {
    try {
      const response = await fetch(`https://17hxyu8crd.execute-api.ap-southeast-1.amazonaws.com/getUserProfile?user_id=${loginData.userId}`);
      const text = await response.text();
  
      if (!response.ok || !text) {
        console.warn("⚠️ Failed or empty response body");
        alert("Login succeeded but failed to retrieve user profile.");
        setCurrentPage("login");
        return;
      }
  
      const profile = JSON.parse(text);
  
      const updatedUser = {
        user_id: profile.user_id,
        username: profile.user_name,
        password: profile.psw,
        account: profile.account,
        isPremium: profile.user_tier === 1,
        transactions: []
      };
  
      console.log("🎉 Logged-in user:", profile);
      setUser(updatedUser);
      await fetchUserCards(profile.user_id);
      setCurrentPage("searchCard");
  
    } catch (error) {
      console.error("Login error:", error);
      alert("Login succeeded but profile fetch failed.");
      setCurrentPage("login");
    }
  };

  const fetchUserCards = async (userId) => {
    try {
      const data = await fetchGet(`/getAllCards?user_id=${userId}`);
      const formatted = data.map(card => ({
        name: card.card,
        card: card.card,
        type: card.type,
        monthly: 0,
        total: parseFloat(card.accumulate_amount || 0),
        minSpend: 0,
        targetAmount: parseFloat(card.target_amount || 0),
        dateApproved: card.date_approved,
      }));

      console.log("💳 Cards loaded from backend:", formatted);
      setCards(formatted);
    } catch (err) {
      console.error("❌ Failed to fetch user cards:", err);
    }
  };

  const addCard = (card) => {
    setCards((prev) => [...prev, card]);
    setCurrentPage("cardList");
  };

  const deleteCard = (cardName) => {
    setCards((prev) => prev.filter(card => card.name !== cardName));
  };

  const handleSearch = (criteria, recommendedCards) => {
    setSearchRebateType(criteria.rebate);  // 👈 新增這行！
  
    const matched = recommendedCards
      .slice(0, user.isPremium ? 3 : 1)
      .map((card, index) => ({
        rank: `${index + 1}${['st', 'nd', 'rd'][index] || 'th'} Choice`,
        name: card.card || card.name,
        rewardType: criteria.rebate,  // ✅ 這也會正確傳下去
        rewardRate: extractRateText(card.rate, criteria.subgroup),
        rewardDetail: card.text || '-',
        imageUrl: card.image_url || card.imageUrl || ''
      }));
  
    setSearchResults(matched);
    setCurrentPage("searchResults");
  };
  

  
  const handleCardChoose = async (cardName, amount, rewardType) => {
    try {
      const candidates = cards.filter(c => c.card === cardName);
      console.log("🔍 Matching candidates:", candidates);
  
      const normalized = (val) =>
        Array.isArray(val)
          ? val.map((v) => v.toLowerCase())
          : typeof val === 'string'
          ? [val.toLowerCase()]
          : [];
  
      const matched = candidates.find(c => {
        const candidateTypes = normalized(c.type);
        const targetType = rewardType?.toLowerCase();
        return candidateTypes.includes(targetType);
      });
  
      const selectedCard = matched || candidates[0];
      const cardType = typeof selectedCard?.type === 'string'
        ? selectedCard.type
        : Array.isArray(selectedCard?.type)
        ? selectedCard.type.find(t => t.toLowerCase() === rewardType.toLowerCase()) || selectedCard.type[0]
        : rewardType || 'unknown';
  
      const payload = {
        user_id: String(user.user_id),
        card: cardName,
        amount: String(amount),
        type: cardType,
      };
  
      console.log("📦 PATCH payload:", payload);
      await fetchPatch("/updateAccumulateAmount", payload);
  
      const updated = cards.map((c) =>
        c.card === cardName && c.type === cardType
          ? { ...c, total: c.total + Number(amount) }
          : c
      );
      setCards(updated);
    } catch (err) {
      console.error("❌ Failed to update accumulate amount:", err);
      alert("Failed to update backend accumulate amount.");
    }
  };
  
  

  // Update this function in your App.js file

function extractRateText(rateString, subgroups = []) {
  try {
    let rateObj = {};
    
    if (typeof rateString === 'string') {
      // Handle common patterns in the malformed JSON
      if (rateString.includes('"Local": 1.3, "Overseas": 2.2"')) {
        // Fix specific known malformed strings
        rateObj = {
          "Local": "1.3",
          "Overseas": "2.2"
        };
        if (rateString.includes('"Agoda": 4.3')) {
          rateObj["Agoda"] = "4.3";
        }
      } else {
        // For other cases, try to safely extract key-value pairs
        // Match pattern like "key": value or "key": "value"
        const keyValueRegex = /"([^"]+)":\s*([^,}]+)/g;
        let match;
        while ((match = keyValueRegex.exec(rateString)) !== null) {
          const key = match[1];
          // Remove any quotes around the value and trim
          let value = match[2].trim();
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          rateObj[key] = value;
        }
      }
    } else if (typeof rateString === 'object') {
      rateObj = rateString;
    }
    
    const rateEntries = subgroups
      .filter(key => rateObj[key] !== undefined)
      .map(key => `${key}: ${rateObj[key]}`);
      
    return rateEntries.length > 0 ? rateEntries.join(', ') : 'N/A';
  } catch (e) {
    console.warn('Error processing rate:', e);
    return 'N/A';
  }
}

  return (
    <>
      {currentPage === "login" && (
        <LoginPage onSignInClick={() => setCurrentPage("signin")} onSignUp={() => setCurrentPage("register")} />
      )}
      {currentPage === "signin" && (
        <SignInPage onLoginSuccess={handleLoginSuccess} onBack={() => setCurrentPage("login")} />
      )}
      {currentPage === "register" && (
        <RegisterPage onCreateAccount={() => setCurrentPage("login")} />

      )}
      {currentPage === "createCard" && (
        <CreateCardPageLayout setCurrentPage={setCurrentPage} user={user} addCard={addCard} />
      )}
      {currentPage === "cardList" && (
        <PageLayout user={user} onCreateCard={() => setCurrentPage("createCard")} onViewCards={() => setCurrentPage("cardList")} onMyAccount={() => setCurrentPage("myAccount")}>
          <CardListPage cards={cards} onBack={() => setCurrentPage("searchCard")} onDelete={deleteCard} user={user} setCardsFromDB={setCards}/>
        </PageLayout>
      )}
      {currentPage === "searchCard" && (
        <PageLayout user={user} onCreateCard={() => setCurrentPage("createCard")} onViewCards={() => setCurrentPage("cardList")} onMyAccount={() => setCurrentPage("myAccount")}>
          <SearchCardPage
            user={user}
            setUser={setUser}
            cards={cards}
            onSearch={handleSearch}
            setSearchAmount={setSearchAmount}
          />
        </PageLayout>
      )}
      {currentPage === "searchResults" && (
        <PageLayout user={user} onCreateCard={() => setCurrentPage("createCard")} onViewCards={() => setCurrentPage("cardList")} onMyAccount={() => setCurrentPage("myAccount")}>
          <SearchResultsPage
            results={searchResults}
            amount={searchAmount}
            isPremium={user.isPremium}
            adsEnabled={adsEnabled}
            searchRebateType={searchRebateType}
            onBack={() => setCurrentPage("searchCard")}
            onCardChoose={async (cardName, type) => {
              await handleCardChoose(cardName, searchAmount, searchRebateType);
              await fetchUserCards(user.user_id);  // ← 新增這行！
              setCurrentPage("cardList");
            }}
          />
        </PageLayout>
      )}
      {currentPage === "myAccount" && (
        <PageLayout
          user={user}
          onCreateCard={() => setCurrentPage("createCard")}
          onViewCards={() => setCurrentPage("cardList")}
          onMyAccount={() => setCurrentPage("myAccount")}
        >
          <MyAccountPage
            onBack={() => setCurrentPage("searchCard")}
            user={user}
            setUser={setUser}
            adsEnabled={adsEnabled}
            setAdsEnabled={setAdsEnabled}
          />
        </PageLayout>
      )}
    </>
  );
}

export default App;
