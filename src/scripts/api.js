// TODO: Silakan sesuaikan BASE URL dari endpoint Anda
const BASE_URL = 'YOUR_BASE_URL';

const ENDPOINT = {
  predict: `${BASE_URL}/predict`,
  regist: `${BASE_URL}/regist`,
};

class PredictAPI {
  static async predict(data) {
    const response = await fetch(ENDPOINT.predict, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Menambahkan header untuk format JSON
      },
      body: JSON.stringify(data), // Menyusun data dalam format JSON
      redirect: 'follow',
    });

    const json = await response.json();
    return json;
  }
}

class RegistAPI {
  static async regist(data) {
    const response = await fetch(ENDPOINT.regist, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Menambahkan header untuk format JSON
      },
      body: JSON.stringify(data), // Menyusun data dalam format JSON
      redirect: 'follow',
    });

    const json = await response.json();
    return json;
  }
}
