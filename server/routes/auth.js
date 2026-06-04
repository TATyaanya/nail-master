const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Эндпоинт регистрации: POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    // ИСПРАВЛЕНО: Убрали лишние кавычки и вернули логическое ИЛИ (||)
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Заполните обязательные поля: имя, email и пароль' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === 'master' ? 'master' : 'client';

        // ИСПРАВЛЕНО: SQL-запрос обернут в правильные кавычки
        const sql = 'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)';
        const params = [name, email, hashedPassword, phone, userRole];

        db.run(sql, params, function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Пользователь с таким email уже зарегистрирован' });
                }
                return res.status(500).json({ error: err.message });
            }

            const token = jwt.sign(
                { id: this.lastID, role: userRole },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Регистрация прошла успешно',
                token,
                user: { id: this.lastID, name, email, phone, role: userRole }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// Эндпоинт авторизации: POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Заполните все поля: email и пароль' });
    }

    try {
        // Ищем пользователя в базе по email
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                return res.status(400).json({ error: 'Неверный email или пароль' });
            }

            // Проверяем, совпадает ли пароль с захешированным в БД
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Неверный email или пароль' });
            }

            // Создаем токен для вошедшего пользователя
            const token = jwt.sign(
                { id: user.id, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Вход выполнен успешно',
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

module.exports = router;