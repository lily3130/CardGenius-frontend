import React, { useState, useEffect } from "react";
import "./App.css";
import TransactionSummary from "./TransactionSummary";

function MyAccountPage({ onBack, user, setUser, adsEnabled, setAdsEnabled }) {
  const [isEditing, setIsEditing] = useState({
    user_name: false,
    account: false,
    password: false,
  });

  const [localUsername, setLocalUsername] = useState(user.username);
  const [localAccount, setLocalAccount] = useState(user.account);
  const [localPassword, setLocalPassword] = useState(user.password);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user?.user_id || !user?.isPremium) return;
      console.log("👑 user_id:", user?.user_id, "isPremium:", user?.isPremium);
      
  
      try {
        const response = await fetch(`https://17hxyu8crd.execute-api.ap-southeast-1.amazonaws.com/getTransactionSummary?user_id=${user.user_id}`);
        const data = await response.json();
        console.log("📬 Fetched summary data:", data);
  
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch summary stats.");
        }
  
        setSummaryData(data); // 儲存 summary 資料
      } catch (err) {
        console.error("❌ Error fetching summary stats:", err);
      }
    };
  
    fetchSummary();
  }, [user]);

  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    const payload = {
      user_id: user.user_id,
      user_name: localUsername,
      account: localAccount,
      psw: localPassword,
      
    };

    try {
      const response = await fetch("https://17hxyu8crd.execute-api.ap-southeast-1.amazonaws.com/updateUserProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Update failed.");
      }

      // 更新前端 user 狀態
      setUser((prevUser) => ({
        ...prevUser,
        username: localUsername,
        account: localAccount,
        password: localPassword,
      }));

      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      alert("Failed to update profile. Please try again.");
    }

    setIsEditing({ user_name: false, account: false, password: false });
  };

  return (
    <div className="account-two-columns">
      {/* 左側欄位 */}
      <div className="account-left-column">
        <h1 className="account-section-title">Account Profile</h1>
        <div className="profile-card">
          <div className="profile-info">
            {/* 使用者名稱 */}
            <div className="info-row">
              <span className="info-label">Name:</span>
              {isEditing.user_name ? (
                <input
                  value={localUsername}
                  onChange={(e) => setLocalUsername(e.target.value)}
                />
              ) : (
                <span className="info-value">{localUsername}</span>
              )}
              <button className="edit-button" onClick={() => handleEdit("user_name")}>✏️ Edit</button>
            </div>

            {/* 帳號 */}
            <div className="info-row">
              <span className="info-label">Account:</span>
              {isEditing.account ? (
                <input
                  value={localAccount}
                  onChange={(e) => setLocalAccount(e.target.value)}
                />
              ) : (
                <span className="info-value">{localAccount}</span>
              )}
              <button className="edit-button" onClick={() => handleEdit("account")}>✏️ Edit</button>
            </div>

            {/* 密碼 */}
            <div className="info-row">
              <span className="info-label">Password:</span>
              {isEditing.password ? (
                <input
                  type="password"
                  value={localPassword}
                  onChange={(e) => setLocalPassword(e.target.value)}
                />
              ) : (
                <span className="info-value">{localPassword}</span>
              )}
              <button className="edit-button" onClick={() => handleEdit("password")}>✏️ Edit</button>
            </div>
          </div>

          {/* 儲存按鈕 */}
          <div className="button-group">
            <button className="save-button" onClick={handleSave}>Save Changes</button>
          </div>
        </div>

        {/* Ads 切換 */}
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
          <span style={{ color: "#aaa" }}>
            {user.isPremium ? "Turn off ads" : "Buy Premium to turn off"}
          </span>
        </div>

        {/* 返回按鈕 */}
        <div className="button-group back-to-search-wrapper">
          <button className="button" onClick={onBack}>Back to Search</button>
        </div>
      </div>

      {/* 右側圖表（Premium 才會顯示） */}
      {user.isPremium && summaryData && (
        <div className="account-right-column">
            <h1 className="transaction-summary-title">Spending Overview</h1>
            <TransactionSummary summary={summaryData} hideTitle={true} />
        </div>
        )}
    </div>
  );
}

export default MyAccountPage;
