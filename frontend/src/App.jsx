import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

// Вспомогательный компонент для защиты приватных страниц
// Если токена нет — перенаправляет на страницу входа
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth/login" />;
};

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>💅 NailApp — Панель управления</h1>
        
        <Routes>
          {/* Автоматический перенаправление с главной страницы на вход */}
          <Route path="/" element={<Navigate to="/auth/login" />} />
          
          {/* Маршруты авторизации */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          
          {/* Приватный маршрут профиля (сделаем его полноценным на следующем шаге) */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
                  <h2>Личный кабинет мастера / клиента</h2>
                  <p>Добро пожаловать в систему! Вы успешно авторизовались.</p>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/auth/login';
                    }}
                    style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;