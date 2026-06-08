const express = require('express');
const router = express.Router();
const db = require('../db/database');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Вспомогательная функция (middleware) для защиты маршрутов
function verifyMasterToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Доступ запрещен: отсутствует токен авторизации' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'master') {
            return res.status(403).json({ error: 'Доступ запрещен: у вас недостаточно прав' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Неверный или просроченный токен' });
    }
}

// 1. ОТКРЫТЫЙ МАРШРУТ: Получить список всех услуг
// GET /api/services
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM services';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 2. ЗАЩИЩЕННЫЙ МАРШРУТ: Добавить новую услугу
// POST /api/services
router.post('/', verifyMasterToken, (req, res) => {
    const { title, description, price, duration } = req.body;

    if (!title || !price || !duration) {
        return res.status(400).json({ error: 'Заполните обязательные поля: название, цена и длительность' });
    }

    const sql = 'INSERT INTO services (title, description, price, duration) VALUES (?, ?, ?, ?)';
    const params = [title, description, price, duration];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: 'Услуга успешно добавлена',
            service: { id: this.lastID, title, description, price, duration }
        });
    });
});

module.exports = router;