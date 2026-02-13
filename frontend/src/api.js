import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Твой URL бэкенда
    withCredentials: true, // ОБЯЗАТЕЛЬНО для передачи кук (JWT)
});

// Перехватчик ОТВЕТОВ (Interceptors)
api.interceptors.response.use(
    (response) => response, // Если всё хорошо, просто возвращаем ответ
    (error) => {
        if (error.response && error.response.status === 401) {
            // ПУНКТ 13: Auto Logout
            console.warn("Сессия истекла или токен невалиден");

            // Очищаем данные (если используешь localStorage)
            localStorage.removeItem('user');

            // Уведомляем пользователя
            toast.error("Session expired. Redirecting to login...");

            // Редирект через 2 секунды
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        }
        return Promise.reject(error);
    }
);

export default api;