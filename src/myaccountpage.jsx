import React, { useState } from "react";
import "./App.css";
import TransactionSummary from "./TransactionSummary";

function MyAccountPage({ onBack, user, setUser, adsEnabled, setAdsEnabled }) {
  const [isEditing, setIsEditing] = useState({
    username: false,
    name: false,
    password: false,
    transactions: [],
  });
  const [localUsername, setLocalUsername] = useState(user.username);

  const [localPassword, setLocalPassword] = useState(user.password);

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSave = () => {
    setUser((prevUser) => ({
        ...prevUser,
        
      username: localUsername,

      password: localPassword,
    }));
    setIsEditing({ username: false, name: false, password: false });
    // 你可以在這裡加上儲存到資料庫的邏輯
  };

  const handleAdsToggle = () => {
    setAdsEnabled(!adsEnabled);
  };

  return (
    <div className="account-two-columns">
        {/* 左欄 */}
        <div className="account-left-column">
            <h1 className="account-section-title">Account Profile</h1>
            <div className="profile-card">
            <div className="profile-info">
                {/* Name */}
                <div className="info-row">
                <span className="info-label">Name:</span>
                {isEditing.username ? (
                    <input value={localUsername} onChange={(e) => setLocalUsername(e.target.value)} />
                ) : (
                    <span className="info-value">{localUsername}</span>
                )}
                <button className="edit-button" onClick={() => handleEdit('username')}>✏️ Edit</button>
                </div>

                {/* Password */}
                <div className="info-row">
                <span className="info-label">Password:</span>
                {isEditing.password ? (
                    <input type="password" value={localPassword} onChange={(e) => setLocalPassword(e.target.value)} />
                ) : (
                    <span className="info-value">{localPassword}</span>
                )}
                <button className="edit-button" onClick={() => handleEdit('password')}>✏️ Edit</button>
                </div>
            </div>

            {/* Save + Back */}
            <div className="button-group">
                <button className="save-button" onClick={handleSave}>Save Changes</button>
            </div>
            </div>

            <div className="ads-toggle">
                <strong>Ads</strong>
                <input
                    type="checkbox"
                    checked={adsEnabled}
                    disabled={!user.isPremium}
                    onChange={(e) => {
                    if (user.isPremium) {
                        setAdsEnabled(e.target.checked);
                    }
                    }}
                />
                <span style={{ color: '#aaa' }}>
                    {user.isPremium ? "Turn off ads" : "Buy Premium to turn off"}
                </span>
            </div>


            <div className="button-group back-to-search-wrapper">
                <button className="button" onClick={onBack}>Back to Search</button>
            </div>
        </div>

        {/* 右欄 - 圖表 */}
        {user.isPremium && user.transactions && user.transactions.length > 0 && (
            <div className="account-right-column">
            <h1 className="transaction-summary-title">Spending Overview</h1>
            <TransactionSummary transactions={user.transactions} hideTitle={true} />
            </div>
        )}
        </div>

  );
}

export default MyAccountPage;
