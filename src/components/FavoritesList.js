// FavoritesList component - Renders saved riddles using RiddleCard
// Shows a message when no favorites are saved

import React from 'react';
import RiddleCard from './RiddleCard';

const FavoritesList = ({ favorites, onRemoveFromFavorites }) => {
  return (
    <div className="favorites-list">
      {favorites.length === 0 ? (
        <p>No favorite riddles yet!</p>
      ) : (
        favorites.map((riddle, index) => (
          <RiddleCard
            key={index}
            riddle={riddle.question}
            answer={riddle.answer}
            isFavorite={true}
            onToggleFavorite={() => onRemoveFromFavorites(riddle)}
          />
        ))
      )}
    </div>
  );
};

export default FavoritesList;