import React, { useState } from 'react';

const RiddleCard = ({ riddle, answer, isFavorite, onToggleFavorite }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="riddle-card">
      <h3>Question: {riddle}</h3>
      <button 
        className="toggle-answer" 
        onClick={() => setShowAnswer(!showAnswer)}
      >
        {showAnswer ? 'Hide Answer' : 'Show Answer'}
      </button>
      {showAnswer && <p className="answer">Answer: {answer}</p>}
      <button 
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={onToggleFavorite}
      >
        {isFavorite ? 'Remove from Favourites' : 'Add to Favourites'}
      </button>
    </div>
  );
};

export default RiddleCard;