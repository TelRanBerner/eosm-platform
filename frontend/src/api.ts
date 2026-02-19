import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// ВАЖНО: Этот перехватчик добавляет токен в каждый запрос
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;