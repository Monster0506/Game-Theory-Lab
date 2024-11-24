import React from 'react';
import './GameHistory.css';

const GameHistory = ({ 
  history,
  roundLabel = 'Round',
  renderRoundContent,
  title = 'Game History'
}) => {
  return (
    <div className="game-history">
      <h3>{title}</h3>
      <div className="history-list">
        {history.map((round, index) => (
          <div key={history.length - index - 1} className="history-item">
            <span className="round-number">
              {roundLabel} {round.round || history.length - index}
            </span>
            {renderRoundContent ? (
              renderRoundContent(round)
            ) : (
              <div className="round-content">
                {Object.entries(round)
                  .filter(([key]) => !['round'].includes(key))
                  .map(([key, value]) => (
                    <span key={key} className="history-entry">
                      {key}: {value}
                    </span>
                  ))
                }
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory;
