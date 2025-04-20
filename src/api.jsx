const BASE_URL = 'https://17hxyu8crd.execute-api.ap-southeast-1.amazonaws.com'; // <-- change this to your backend URL

export async function fetchGet(endpoint) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) {
        const text = await res.text();
        console.warn("⚠️ GET not OK. Status:", res.status, "Body:", text);
        throw new Error(`GET failed: ${res.status}`);
      }
  
      const text = await res.text();
  
      if (!text) {
        console.warn("⚠️ Response body is empty");
        return null;
      }
  
      return JSON.parse(text);
    } catch (err) {
      console.error("GET Error:", err);
      throw err;
    }
  }

export async function fetchPost(endpoint, body) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      // ✅ 加上內容檢查，避免空回傳時呼叫 json() 失敗
      const text = await res.text();
      if (!res.ok) throw new Error(`POST failed: ${res.status}`);
      if (!text) throw new Error("Empty response body");
  
      return JSON.parse(text);  // 改用 JSON.parse 可以做錯誤處理
    } catch (err) {
      console.error('POST Error:', err);
      throw err;
    }
  }

export async function fetchDelete(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('DELETE Error:', err);
    throw err;
  }
}

export async function fetchPatch(endpoint, body) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const text = await res.text(); // 嘗試讀取純文字，避免 JSON parsing error
  
      if (!res.ok) {
        throw new Error(`PATCH failed: ${res.status} - ${text}`);
      }
  
      try {
        return JSON.parse(text); // 如果是 JSON 就轉
      } catch (e) {
        return text; // 不是 JSON 就原樣傳回
      }
  
    } catch (err) {
      console.error('PATCH Error:', err);
      throw err;
    }
  }