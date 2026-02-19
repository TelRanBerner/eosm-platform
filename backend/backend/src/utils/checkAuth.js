import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    // Пытаемся взять токен из заголовка Authorization ИЛИ из кук
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '') || req.cookies?.token;

    if (token) {
        try {
            // ВАЖНО: Ключ должен быть таким же, как при создании токена в UserController
            const decoded = jwt.verify(token, 'eosm_super_secret_key_2026');

            // Сохраняем ID пользователя для дальнейшего использования в контроллерах
            req.userId = decoded._id;

            next();
        } catch (e) {
            // Если токен есть, но он кривой или просрочен
            return res.status(403).json({ message: 'Нет доступа (невалидный токен)' });
        }
    } else {
        // Если токена нет вообще
        return res.status(403).json({ message: 'Нет доступа (токен не найден)' });
    }
};