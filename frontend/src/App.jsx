// App.jsx
import Register from './components/Register';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      margin: '0',        // Убирает внешние отступы
      padding: '0',       // Убирает внутренние отступы
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url(/back.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      // Устанавливаем темно-коричневый цвет для всего содержимого
      color: '#4B3621', 
      fontFamily: '"Segoe UI", Roboto, sans-serif'
    }}>
      <Register />
    </div>
  );
}

export default App;
