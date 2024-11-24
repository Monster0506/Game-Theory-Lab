import React from 'react';
import './ScoreBoard.css';

const ScoreBoard = ({ 
  scores,
  labels = { player: 'Your Score', opponent: 'Opponent Score' }
}) => {
  return (
    <div className="score-board">
      {Object.entries(scores).map(([key, score]) => (
        <div key={key} className="score-box">
          <h3>{labels[key] || key}</h3>
          <p>{score}</p>
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard;
