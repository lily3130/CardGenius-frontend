import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './sidebar';
import PageLayout from './pagelayout';
import CreateCardPage from "./createcardpage";
import { cardRebateType, bankCardOptions } from './constants';

function CreateCardPageLayout({ setCurrentPage, user, addCard, cardRebateType, bankCardOptions }) {
    const handleGoBack = () => setCurrentPage('searchCard');
    const handleGoMyAccount = () => setCurrentPage('myAccount');
    const handleGoCreateCard = () => setCurrentPage('createCard');
    const handleGoToCardList = () => setCurrentPage('cardList');
  
    return (
      <PageLayout
        onCreateCard={handleGoCreateCard}
        onViewCards={handleGoToCardList}
        onMyAccount={handleGoMyAccount}
        user={user}
      >
        <CreateCardPage
          onBack={handleGoBack}
          onSaveCard={addCard}
          cardRebateType={cardRebateType}
          bankCardOptions={bankCardOptions}
        />
      </PageLayout>
    );
  }
  export default CreateCardPageLayout; 
  