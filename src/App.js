// Main App component handling riddle fetching, favorites management, and UI state
// Made by Shashank Goel 

import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import RiddleCard from './components/RiddleCard';
import FavoritesList from './components/FavoritesList';
import './App.css';

function App() {
  // Manage active tab state - either 'random' or 'favorites'
  const [activeTab, setActiveTab] = useState('random');
  
  // Track current riddle being displayed
  const [currentRiddle, setCurrentRiddle] = useState(null);
  
  // Load favorites from localStorage on initial render
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  // UI state management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch a new riddle from the API
  // Handles various error cases and updates UI accordingly
  const fetchRiddle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://riddles-api-eight.vercel.app/funny');
      //The API given in the question paper, was not fetching any riddles so I used another one
      
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

  // Helper to start the interval for auto-fetching riddles
  // Returns interval ID for cleanup
  const startInterval = () => {
    return setInterval(fetchRiddle, 15000); // Fetch new riddle every 15 seconds
  };

  // Setup initial fetch and auto-refresh interval
  useEffect(() => {
    fetchRiddle();
    const interval = startInterval();
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Sync favorites with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle adding/removing riddles from favorites
  // Includes validation, duplication checks, and user feedback
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
