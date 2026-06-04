const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Подключаем роуты аутентификации
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Бэкенд NailApp для Windows успешно запущен!');
});

app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}. Ссылка: http://localhost:${PORT}`);
});