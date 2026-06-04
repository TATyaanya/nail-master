const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Безопасный путь к файлу базы данных для Windows
const dbPath = path.resolve(__dirname, 'nailapp.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка подключения к SQLite:', err.message);
    } else {
        console.log('Подключено к базе данных SQLite.');
        createTables();
    }
});

function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            role TEXT DEFAULT 'client'
        )
    `, (err) => {
        if (err) {
            console.error('Ошибка создания таблицы users:', err.message);
        } else {
            console.log('Таблица users готова к работе.');
        }
    });
}

module.exports = db;