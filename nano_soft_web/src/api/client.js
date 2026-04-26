import axios from 'axios';

const API_BASE_URL = 'https://account.now-ye.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// إضافة التوكن تلقائياً لكل الطلبات إذا كان موجوداً
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nano_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
