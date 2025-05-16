import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import RiddleCard from './components/RiddleCard';
import FavoritesList from './components/FavoritesList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('random');
  const [currentRiddle, setCurrentRiddle] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRiddle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://riddles-api-eight.vercel.app/funny');
      if (!response.ok) throw new Error('Failed to fetch riddle');
      const data = await response.json();
      setCurrentRiddle({
        question: data.riddle,
        answer: data.answer
      });
    } catch (err) {
      console.error('Error fetching riddle:', err);
      setError('Failed to fetch riddle. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
// ... existing code ...
  useEffect(() => {
    fetchRiddle();
    const interval = setInterval(fetchRiddle, 15000); // Changed from 5000 to 15000 (15 seconds)
    return () => clearInterval(interval);
  }, []);
// ... existing code ...    fetchRiddle();
    const interval = setInterval(fetchRiddle, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (riddle) => {
    const isFavorite = favorites.some(fav => fav.question === riddle.question);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.question !== riddle.question));
    } else {
      setFavorites([...favorites, riddle]);
    }
  };

  return (
    <div className="App">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'random' ? (
        <div className="random-riddle-container">
          {error && <div className="error-message">{error}</div>}
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            currentRiddle && (
              <RiddleCard
                riddle={currentRiddle.question}
                answer={currentRiddle.answer}
                isFavorite={favorites.some(fav => fav.question === currentRiddle.question)}
                onToggleFavorite={() => toggleFavorite(currentRiddle)}
              />
            )
          )}
        </div>
      ) : (
        <FavoritesList
          favorites={favorites}
          onRemoveFromFavorites={toggleFavorite}
        />
      )}
    </div>
  );
}

export default App;
