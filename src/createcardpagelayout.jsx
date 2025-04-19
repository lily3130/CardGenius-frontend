import React from 'react';
import PageLayout from './pagelayout';
import CreateCardPage from "./createcardpage";

function CreateCardPageLayout({ setCurrentPage, user, addCard }) {
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
        user={user}
        onBack={handleGoBack}
        onSaveCard={addCard}
      />
    </PageLayout>
  );
}

export default CreateCardPageLayout;
