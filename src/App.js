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
  const [notification, setNotification] = useState(null);

  const fetchRiddle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://riddles-api-eight.vercel.app/funny');
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Riddle service not found. Please try again later.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Our riddle service is taking a break.');
        } else {
          throw new Error(`Failed to fetch riddle (Status: ${response.status})`);
        }
      }

      const data = await response.json();
      
      if (!data || !data.riddle || !data.answer) {
        throw new Error('Invalid riddle data received');
      }
      
      setCurrentRiddle({
        question: data.riddle,
        answer: data.answer
      });
    } catch (err) {
      console.error('Error fetching riddle:', err);
      setError(err.message || 'Failed to fetch riddle. Please try again later.');
      // Stop the interval if we get an error
      if (err.message.includes('Too many requests')) {
        clearInterval(interval);
        setTimeout(() => {
          fetchRiddle();
          startInterval();
        }, 5000); // Wait 5 seconds before retrying
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startInterval = () => {
    return setInterval(fetchRiddle, 15000);
  };

  useEffect(() => {
    fetchRiddle();
    const interval = startInterval();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (riddle) => {
    if (!riddle || !riddle.question || !riddle.answer) {
      setNotification({
        type: 'error',
        message: 'Invalid riddle data. Cannot add to favorites.'
      });
      return;
    }

    const isFavorite = favorites.some(fav => 
      fav.question.toLowerCase().trim() === riddle.question.toLowerCase().trim()
    );

    if (isFavorite) {
      setFavorites(favorites.filter(fav => 
        fav.question.toLowerCase().trim() !== riddle.question.toLowerCase().trim()
      ));
      setNotification({
        type: 'success',
        message: 'Riddle removed from favorites'
      });
    } else {
      // Check for maximum favorites limit (optional)
      if (favorites.length >= 50) {
        setNotification({
          type: 'error',
          message: 'Maximum favorites limit reached (50)'
        });
        return;
      }

      setFavorites([...favorites, {
        question: riddle.question.trim(),
        answer: riddle.answer.trim()
      }]);
      setNotification({
        type: 'success',
        message: 'Riddle added to favorites'
      });
    }

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="App">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      {activeTab === 'random' ? (
        <div className="random-riddle-container">
          {error && (
            <div className="error-message">
              <span>{error}</span>
              <button onClick={fetchRiddle}>Try Again</button>
            </div>
          )}
          {isLoading ? (
            <div className="loading">Fetching your riddle</div>
          ) : (
            currentRiddle && (
              <RiddleCard
                riddle={currentRiddle.question}
                answer={currentRiddle.answer}
                isFavorite={favorites.some(fav => 
                  fav.question.toLowerCase().trim() === currentRiddle.question.toLowerCase().trim()
                )}
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
