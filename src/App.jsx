import React, { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./loginpage";
import RegisterPage from "./registerpage";
import CreateCardPageLayout from "./createcardpagelayout";
import { cardRebateType, bankCardOptions } from './constants';
import CardListPage from "./cardlist";
import SearchCardPage from './searchcardpage';
import PageLayout from './pagelayout';
import SearchResultsPage from './searchresultspage';
import MyAccountPage from './myaccountpage';

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState({
    username: "Avatar",
    password: "*******",
    isPremium: false,  // ✅ 要有這行！
    transactions: []
  });
  const [cards, setCards] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searchAmount, setSearchAmount] = useState('');
  const [adsEnabled, setAdsEnabled] = useState(true); // 預設開啟廣告

  const handleSignIn = (premium) => {
    setUser(prev => ({
      ...prev,
      isPremium: premium
    }));
    setCurrentPage("searchCard");
  };

  const handleSignUp = (newUser) => {
    setUser({
      ...newUser,
      isPremium: isPremium
    });
    setCurrentPage("register");
  };

  const handleCreateAccount = (newUser) => {
    setUser({
      ...newUser,
      isPremium: isPremium,     // 用註冊前選的 premium 狀態
      transactions: [],
    });
    setCurrentPage("createCard");
  };

  const addCard = (card) => {
    setCards((prevCards) => [
      ...prevCards,
      {
        ...card,
        monthly: 0,
        total: 0,
      }
    ]);
    setCurrentPage('cardList');
  };

  const deleteCard = (index) => {
    setCards((prevCards) => prevCards.filter((_, i) => i !== index));
  };

  const goToCardList = () => {
    setCurrentPage('cardList');
  };

  const handleSearch = (searchCriteria) => {
    const { category, transactionTypes, amount, rebate } = searchCriteria;

    // 根據卡片資料與搜尋條件，簡單過濾符合的卡片
    const matched = cards
      .filter(card => {
        const rebateMatch = cardRebateType[card.name]?.rebateType === rebate;
        const categoryMatch = cardTransactionMap[card.name]?.[category];
        return rebateMatch && categoryMatch;
      })
      .slice(0, 3) // 最多只要三個結果
      .map((card, index) => ({
        rank: `${index + 1}${['st', 'nd', 'rd'][index] || 'th'} Choice`,
        name: card.name,
        rewardType: cardRebateType[card.name]?.rebateType || 'unknown',
        rewardRate: (Math.random() * 0.05).toFixed(4), // 💡 假裝有 reward rate
        rewardDetail: `Some benefit for ${category} - ${rebate}`
      }));

    setSearchResults(matched);
    setCurrentPage('searchResults');
  };

  const handleCardChoice = (cardName, amount) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.name === cardName
          ? {
              ...card,
              monthly: card.monthly + Number(amount),
              total: card.total + Number(amount),
            }
          : card
      )
    );
    // 記錄 transaction（僅限 premium）
    if (user.isPremium) {
      const newTransaction = {
        category: searchCriteria.category,
        rebateType: searchCriteria.rebate,
        amount,
        selectedCard: cardName
      };

      setUser(prev => ({
        ...prev,
        transactions: [...(prev.transactions || []), newTransaction]
      }));
    }
  };

  return (
    <>
      {currentPage === "login" && (
        <LoginPage onSignUp={handleSignUp} onSignIn={handleSignIn} />
      )}

      {currentPage === "register" && (
        <RegisterPage onCreateAccount={handleCreateAccount} />
      )}

      {currentPage === 'createCard' && (
        <CreateCardPageLayout 
          setCurrentPage={setCurrentPage}
          user={user}
          addCard={addCard}
          cardRebateType={cardRebateType}
          bankCardOptions={bankCardOptions}
        />
      )}

      {currentPage === 'myAccount' && (
        <PageLayout
        onCreateCard={() => setCurrentPage('createCard')}
        onViewCards={goToCardList}
        onMyAccount={() => setCurrentPage('myAccount')}
        user={user}
      >
          <MyAccountPage 
            onBack={() => setCurrentPage('searchCard')}
            user={user}
            setUser={setUser}
            adsEnabled={adsEnabled}
            setAdsEnabled={setAdsEnabled}
          />
        </PageLayout>
      )}

      {currentPage === 'cardList' && (
        <PageLayout
        onCreateCard={() => setCurrentPage('createCard')}
        onViewCards={goToCardList}
        onMyAccount={() => setCurrentPage('myAccount')}
        user={user}
      >
          <CardListPage
            cards={cards}
            onBack={() => setCurrentPage('searchCard')}
            onDelete={deleteCard}
            user={user}
          />
        </PageLayout>
      )}

      {currentPage === 'searchCard' && (
        <PageLayout
        onCreateCard={() => setCurrentPage('createCard')}
        onViewCards={goToCardList}
        onMyAccount={() => setCurrentPage('myAccount')}
        user={user}
      >
          <SearchCardPage
            onCreateCard={() => setCurrentPage('createCard')}
            onViewCards={goToCardList}
            cards={cards}
            setSearchAmount={setSearchAmount}
            onSearch={(criteria, results) => {
              setSearchCriteria(criteria);
              setSearchResults(results);
              setCurrentPage('searchResults');
            }}
            user={user}          
            setUser={setUser}
          />
        </PageLayout>
      )}

      {currentPage === 'searchResults' && (
        <PageLayout
        onCreateCard={() => setCurrentPage('createCard')}
        onViewCards={goToCardList}
        onMyAccount={() => setCurrentPage('myAccount')}
        user={user}
      >
          <SearchResultsPage
            results={searchResults}
            isPremium={user.isPremium}
            adsEnabled={adsEnabled}
            amount={searchAmount}
            onBack={() => setCurrentPage('searchCard')}
            onCardChoose={(cardName) =>{
              handleCardChoice(cardName, searchAmount);
              setCurrentPage('cardList');
            }}
          />
        </PageLayout>
      )}
    </>
  );
}

export default App;
