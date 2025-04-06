import React, { useState } from "react";
import "./App.css";

function SearchResultsPage({ results = [], isPremium, onBack, onCardChoose, adsEnabled, }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? results.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % results.length);
  };

  if (!results || results.length === 0) {
    return (
      <div className="centered-content">
        <h1 className="welcome-title">No Matching Cards Found</h1>
        <button className="button" onClick={onBack}>Back to Search</button>
      </div>
    );
  }

  const current = isPremium ? results[currentIndex] : results[0];

  

  return (
    <div className="centered-content">
      <h1 className="welcome-title">{isPremium ? current.rank : "1st Choice"}</h1>

      <div className="result-card">
        <div className="card-header">
          <div>
            <h2>{current.name}</h2>
            <div><strong>Reward Type:</strong> {current.rewardType}</div>
            <div><strong>Reward Rate:</strong> {current.rewardRate}</div>
          </div>
          <div className="card-image-placeholder" style={{ width: 140, height: 100, background: "#e2e2e2" }}>
            <span role="img" aria-label="placeholder">🖼</span>
          </div>
        </div>

        <div className={`reward-details-with-arrows ${!isPremium ? 'no-arrows' : ''}`}>
          {isPremium && results.length > 1 && (
            <button
              className={`nav-arrow left ${currentIndex === 0 ? 'invisible' : ''}`}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ◀
            </button>
          )}

          <div className="reward-details">
            <h4>Reward Detail</h4>
            <div className="reward-box">
              - {current.rewardDetail}
            </div>
          </div>

          {isPremium && results.length > 1 && (
            <button
              className={`nav-arrow right ${currentIndex === results.length - 1 ? 'invisible' : ''}`}
              onClick={handleNext}
              disabled={currentIndex === results.length - 1}
            >
              ▶
            </button>
          )}
      </div>

      <div className="result-footer">
        <div className="result-buttons">
          <button className="button" onClick={onBack}>Back to Search</button>
          <button className="button" onClick={() => onCardChoose(current.name)}>
              Choose this One
            </button>
        </div>
      </div>

      {adsEnabled && (
        <div className="ads-section">
          <div className="ads-placeholder">📰 Ads</div>
        </div>
      )}
      
    </div>
    </div>
  );
}

export default SearchResultsPage;