import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  // Состояния для видимости паролей
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Общее сообщение об успехе от сервера
  const [message, setMessage] = useState('');
  
  // Объект для раздельных ошибок под каждым полем
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    global: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Очищаем ошибку поля, когда пользователь начинает заново вводить данные
    setErrors({
      ...errors,
      [e.target.name]: '',
      global: ''
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Пароль должен быть не менее 6 символов';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну заглавную букву';
    }
    if (!/[a-z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну строчную букву';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Пароль должен содержать хотя бы один специальный символ';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // Сброс объекта ошибок перед новой валидацией
    const currentErrors = { name: '', email: '', password: '', confirmPassword: '', global: '' };
    let hasError = false;

    if (!formData.name.trim()) {
      currentErrors.name = 'Имя обязательно для заполнения';
      hasError = true;
    }

    if (!validateEmail(formData.email)) {
      currentErrors.email = 'Введите корректный email (например, name@gmail.com)';
      hasError = true;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      currentErrors.password = passwordError;
      hasError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      currentErrors.confirmPassword = 'Пароли не совпадают';
      hasError = true;
    }

    if (hasError) {
      setErrors(currentErrors);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      // Принудительно ставим роль 'client', так как выбор убрали
      const finalData = { ...dataToSend, role: 'client' };

      const response = await axios.post('http://localhost:5000/api/auth/register', finalData);
      setMessage(response.data.message);
      setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
    } catch (err) {
      setErrors({
        ...currentErrors,
        global: err.response?.data?.error || 'Ошибка регистрации'
      });
    }
  };

  // Стили для инпутов
  const inputStyle = (hasFieldError) => ({
    width: '100%',
    padding: '11px',
    marginTop: '6px',
    boxSizing: 'border-box',
    border: hasFieldError ? '1px solid #b32d44' : '1px solid #e2d9f3',
    borderRadius: '20px',
    backgroundColor: '#fff',
    outline: 'none',
    fontSize: '14px',
  });

  // Стили для контейнера пароля (чтобы разместить кнопку «глаз»)
  const passwordContainerStyle = {
    position: 'relative',
    width: '100%'
  };

  // Стили для кнопки переключения видимости
  const eyeButtonStyle = {
    position: 'absolute',
    right: '15px',
    top: '55%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#532121',
    fontSize: '12px',
    fontWeight: '600',
    padding: '0'
  };


  // Стили для текста ошибок под полями
  const errorTextStyle = {
    display: 'block',
    fontSize: '12px',
    color: '#b32d44',
    marginTop: '5px',
    marginLeft: '8px',
    fontWeight: '500'
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '700px',
      padding: '35px 30px',
      borderRadius: '24px',
      // ЭФФЕКТ МАТОВОГО СТЕКЛА: полупрозрачный белый фон + размытие
      background: 'rgba(255, 255, 255, 0.65)', 
      backdropFilter: 'blur(10px)', // Размывает картинку под формой
      WebkitBackdropFilter: 'blur(10px)', // Для поддержки в Safari
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', // Мягкая тень, чтобы форма читалась
      border: '1px solid rgba(255, 255, 255, 0.4)',
      boxSizing: 'border-box'
    }}>

      <h2 style={{ 
        textAlign: 'center', 
        margin: '0 0 25px 0', 
        color: '#532121', 
        fontFamily: '"Segoe UI", Roboto, sans-serif',
        fontSize: '26px',
        fontWeight: '600'
      }}>
        Создать аккаунт
      </h2>
      
      {message && <p style={{ color: '#2d7a4d', backgroundColor: '#e6f9ed', padding: '10px', borderRadius: '12px', fontSize: '14px', textAlign: 'center', fontWeight: '500', marginBottom: '20px' }}>{message}</p>}
      {errors.global && <p style={{ color: '#b32d44', backgroundColor: '#ffeef0', padding: '10px', borderRadius: '12px', fontSize: '14px', textAlign: 'center', fontWeight: '500', marginBottom: '20px' }}>{errors.global}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* ДВЕ КОЛОНКИ С ПОМОЩЬЮ CSS FLEXBOX */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* Левая колонка */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#532121', marginLeft: '8px' }}>Имя *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle(errors.name)} placeholder="Ваше имя" />
              {errors.name && <span style={errorTextStyle}>{errors.name}</span>}
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#532121', marginLeft: '8px' }}>Email *</label>
              <input type="text" name="email" value={formData.email} onChange={handleChange} style={inputStyle(errors.email)} placeholder="name@gmail.com" />
              {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
            </div>

            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#532121', marginLeft: '8px' }}>Телефон</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle(false)} placeholder="+375 (XX) XXX-XX-XX" />
            </div>
          </div>

          {/* Правая колонка */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#532121', marginLeft: '8px' }}>Пароль *</label>
              <div style={passwordContainerStyle}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  style={inputStyle(errors.password)} 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeButtonStyle}>
                  {showPassword ? 'Скрыть' : 'Показать'}
                </button>
              </div>
              {errors.password ? (
                <span style={errorTextStyle}>{errors.password}</span>
              ) : (
                <span style={{ display: 'block', fontSize: '11px', color: '#532121', marginTop: '5px', marginLeft: '8px' }}>
                  Мин. 6 симв., заглавная, строчная и спец. символ
                </span>
              )}
            </div>


            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#532121', marginLeft: '8px' }}>Повторите пароль *</label>
              <div style={passwordContainerStyle}>
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  style={inputStyle(errors.confirmPassword)} 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={eyeButtonStyle}>
                  {showConfirmPassword ? 'Скрыть' : 'Показать'}
                </button>
              </div>
              {errors.confirmPassword && <span style={errorTextStyle}>{errors.confirmPassword}</span>}
            </div>
          </div>

        </div>

        <button type="submit" style={{ 
          marginTop: '10px',
          padding: '13px', 
          //#edcfca// ece9dd
          background: 'linear-gradient(90deg, #ffcbd1 0%, #ece9dd 50%, #edcfca 100%)',
          color: '#532121', 
          border: 'none', 
          borderRadius: '25px', 
          cursor: 'pointer', 
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(115, 69, 69, 0.4)',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.01)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default Register;
