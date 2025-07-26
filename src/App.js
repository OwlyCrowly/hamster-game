// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import WebApp from '@twa-dev/sdk';

function App() {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [clicks, setClicks] = useState([]); // Храним данные о кликах: {id, x, y, points}

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    WebApp.enableClosingConfirmation();
    console.log('Telegram Web App инициализирован!');
  }, []);

  // === Модифицируем handleClick для ШАГА 4 ===
  const handleClick = (e) => { // Добавляем параметр события
    const now = Date.now();
    const timeDiff = now - lastClickTime;
    
    if (timeDiff < 300) {
      setCombo(prevCombo => prevCombo + 1);
    } else {
      setCombo(1);
    }
    
    const points = 1 + Math.floor(combo / 3);
    setScore(prevScore => prevScore + points);
    setLastClickTime(now);
    
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 200);
    
    // === ШАГ 4: Генерация данных для плавающего числа ===
    setClicks(prev => [
      ...prev, 
      {
        id: Date.now(), // Уникальный ID
        x: e.clientX - 30, // Позиция X клика
        y: e.clientY - 50, // Позиция Y клика
        points, // Количество очков
        color: `hsl(${Math.random() * 360}, 70%, 50%)` // Случайный цвет
      }
    ]);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="score-container">
          <h1>🦫 {score}</h1>
          {/* === ШАГ 4: Улучшаем анимацию комбо === */}
          {combo > 1 && (
            <div className="combo" key={combo} style={{ 
              transform: `scale(${1 + combo * 0.05})`,
              background: `hsl(${120 - combo * 5}, 70%, 40%)`
            }}>
              x{combo} COMBO!
            </div>
          )}
        </div>
      </header>

      <main className="main">
        <div className="capybara-container">
          <div 
            className={`capybara ${isShaking ? 'shake' : ''}`} 
            onClick={handleClick} // Теперь передаем событие
          >
            <div className="ear left"></div>
            <div className="ear right"></div>
            <div className="face-container">
              <div className="eyes">● ●</div>
              <div className="mouth">ᴗ</div>
            </div>
          </div>
        </div>
        
        {/* === ШАГ 4: Рендерим плавающие числа === */}
        {clicks.map(click => (
          <FloatingText 
            key={click.id}
            id={click.id}
            x={click.x}
            y={click.y}
            points={click.points}
            color={click.color}
            onComplete={() => setClicks(prev => prev.filter(c => c.id !== click.id))}
          />
        ))}
      </main>

      <footer className="footer">
         
      </footer>
    </div>
  );
}
// === ШАГ 4: Создаем новый компонент для плавающего текста ===
const FloatingText = ({ id, x, y, points, color, onComplete }) => {
  // Автоматическое удаление через 1 секунду
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="floating-text"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        color: color,
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        fontSize: `${1.5 + points * 0.3}rem`,
        animation: `floatUp ${0.5 + Math.random() * 0.3}s ease-out forwards`
      }}
    >
      +{points}
    </div>
  );
};

export default App;