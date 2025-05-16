import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navigation">
      <button 
        className={`nav-btn ${activeTab === 'random' ? 'active' : ''}`}
        onClick={() => setActiveTab('random')}
      >
        Random Riddles
      </button>
      <button 
        className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
        onClick={() => setActiveTab('favorites')}
      >
        Favourites
      </button>
    </nav>
  );
};

export default Navigation;