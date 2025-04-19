const BASE_URL = 'https://17hxyu8crd.execute-api.ap-southeast-1.amazonaws.com'; // <-- change this to your backend URL

export async function fetchGet(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('GET Error:', err);
    throw err;
  }
}

export async function fetchPost(endpoint, body) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST failed: ${res.status}`);
    return await res.json();
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
      if (!res.ok) throw new Error(`PATCH failed: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('PATCH Error:', err);
      throw err;
    }
  } 