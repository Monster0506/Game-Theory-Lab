import React from 'react';
import './GameResult.css';

const GameResult = ({ 
  result,
  choices,
  getMessage,
  title = 'Round Result',
  choiceLabels = { player: 'Your choice', opponent: "Opponent's choice" }
}) => {
  if (!result) return null;

  return (
    <div className="game-result">
      <h3>{title}</h3>
      <p className="result-message">{getMessage(result, choices)}</p>
      <div className="choices-display">
        {Object.entries(choices).map(([player, choice]) => (
          <p key={player} className={`choice-display ${player}`}>
            <span className="label">{choiceLabels[player] || player}:</span>
            <span className="value">{choice}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default GameResult;
