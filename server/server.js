const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
// 1. Импортируем новый роут для услуг
const servicesRoutes = require('./routes/services');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Подключаем роуты аутентификации 
app.use('/api/auth', authRoutes);

// 2. Подключаем новый роут для управления услугами 
app.use('/api/services', servicesRoutes);

app.get('/', (req, res) => {
    res.send('Бэкенд NailApp для Windows успешно запущен!');
});

app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}. Ссылка: http://localhost:${PORT}`);
});