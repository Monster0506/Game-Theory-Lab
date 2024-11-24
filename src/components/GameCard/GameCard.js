import React from 'react';
import { useNavigate } from 'react-router';
import './GameCard.css';

const GameCard = ({ game }) => {
  const navigate = useNavigate();
  const { title, description, image, status } = game;

  const handlePlay = () => {
    if (status === 'Ready to Play') {
      const route = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      navigate(`/game/${route}`);
    }
  };

  return (
    <div className="game-card">
      <div className="game-card-image">
        <img src={image} alt={title} />
        <div className={`status-badge ${status === 'Ready to Play' ? 'ready' : 'coming-soon'}`}>
          {status}
        </div>
      </div>
      <div className="game-card-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <button 
          className={`play-button ${status === 'Ready to Play' ? 'active' : 'disabled'}`}
          onClick={handlePlay}
          disabled={status !== 'Ready to Play'}
        >
          {status === 'Ready to Play' ? 'Play Now' : 'Coming Soon'}
        </button>
      </div>
    </div>
  );
};

export default GameCard;
