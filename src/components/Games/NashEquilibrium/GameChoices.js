import React from 'react';
import { choices } from './GameLogic';

const GameChoices = ({ onChoice, disabled }) => {
  return (
    <div className="game-choices">
      <h3>Choose Your Strategy</h3>
      <div className="choice-buttons">
        {choices.map(choice => (
          <button
            key={choice}
            onClick={() => onChoice(choice)}
            disabled={disabled}
            className={`choice-button ${disabled ? 'disabled' : ''}`}
          >
            Strategy {choice}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameChoices;
